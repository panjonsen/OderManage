import Network from './axios';




// export const GetAudioBatchList = () => api({
//     url: 'api/record/index/GetBatchList', // 请求地址
//     method: 'get', // 请求方式
//
// })
// export const GetAudioBatchList = () => Network.get('api/record/index/GetBatchList')
// export const GetAudioListByBatchId = (post) => Network.post('api/record/index/GetAudioListByBatchId', post)




export const GetAddrsByUser = (post: {} | undefined) => Network.post('api/Order/GetAddrs',post);


export const GetOrders = (post: {} | undefined) => Network.post('api/Order/GetOrders',post);


export const AdminImport = (post: {} | undefined) => Network.post('api/Order/AdminImportText',post);
export const AdminList = (post: {} | undefined) => Network.post('api/Order/AdminList',post);





export const LoginApi = (post: {} | undefined) => Network.post('api/Login/Login',post);
export const GetIphoneModelInfoListApi = (post: {} | undefined) => Network.post('api/IPhoneModel/GetIphoneModelInfoList',post);
export const GetShopAddrApi = (post: {} | undefined) => Network.post('api/IPhoneModel/GetShopAddr',post);



///
export const ImportDataApi = (post: {} | undefined) => Network.post('api/IPhoneModel/ImportData',post);
export const GetImportDataApi = (post: {} | undefined) => Network.post('api/IPhoneModel/GetImportData',post);


export const UploadBatchApi = (post: {} | undefined) => Network.post('api/IPhoneModel/UploadBatch',post);

export const EditTxtApi = (post: {} | undefined) => Network.post('api/IPhoneModel/EditTxt',post);

export const DeleteTxtApi = (post: {} | undefined) => Network.post('api/IPhoneModel/DeleteTxt',post);
export const GetOrderDataApi = (post: {} | undefined) => Network.post('api/IPhoneModel/GetOrderData',post);
// export const AdminImportTextApi = (post: {} | undefined) => Network.post('api/Order/AdminImportText',post);
export const GetNotifyApi = (post: {} | undefined) => Network.post('api/IPhoneModel/GetNotify',post);
export const ClickNotifyApi = (post: {} | undefined) => Network.post('api/IPhoneModel/ClickNotify',post);





// export const GetAudioBatchList = (params) => api({
//     url: '/record/index/GetBatchList', // 请求地址
//     method: 'get', // 请求方式
//     // data: params, // (一般post请求，我们习惯使用 data属性来传参)
//     params: params //(一般get请求，我们习惯使用params属性来传参）
//     // 注意：data，和 params 两个属性传参使用，并不是固定的，也可以调换使用。
// })

