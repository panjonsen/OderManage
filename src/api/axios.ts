import axios from "axios";

// 进行一些全局配置
let baseURL = window.location.protocol + '//' + window.location.hostname + ':8090/';

axios.defaults.baseURL = baseURL;
// axios.defaults.baseURL = 'http://localhost:8090/'

// axios.defaults.baseURL = 'http://115.218.155.39:8090/'



axios.defaults.timeout = 60000;
// axios.defaults.responseType="blob";








// 添加请求拦截器
axios.interceptors.request.use(function(config) {


    const userStr: any = localStorage.getItem("User");
  
    if (userStr!=null) {
        const user: { UserName: string; Password: number } = JSON.parse(userStr);
        console.log("?");
        console.log(user.UserName);
        // 设置默认token
        config.headers["Auth"] = user.UserName + ":" + user.Password;
    }

   
    

    console.log(config.url + ":正常请求");
    return config;
}, function(error) {
    // 对请求错误做些什么  我给错误一刀。
    console.log(error.url + ":错误请求");
    return error;
    // return Promise.reject('111');
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    console.log(response.config.url + ":正常响应");

    return response;
}, function(error) {
    console.log(error.url + ":错误响应");
    return error;
});
// 封装自己的get/post方法
export default {
    get: function(path = "", data = {}) {
        return new Promise(function(resolve, reject) {
            axios.get(path, {
                params: data
            })
                .then(function(response) {
                    // resolve(response.data)
                    resolve(response);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    },
    post: function(path = "", data = {}) {
        return new Promise(function(resolve, reject) {
            axios.post(path, data)
                .then(function(response) {
                    // resolve(response.data)
                    resolve(response);
                })
                .catch(function(error) {
                    reject(error);
                });
        });
    },
    all: function(list: unknown[]) {
        return new Promise(function(resolve, reject) {
            axios.all(list)
                .then(axios.spread(function(...result) {
                    // 两个请求现在都执行完成
                    resolve(result);
                }))
                .catch(function(err) {
                    reject(err);
                });
        });
    }
};