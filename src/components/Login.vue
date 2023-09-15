<template>
  <el-container
    style="
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <el-card style="width: 400px">
      <div>Login</div>
      <div style="padding: 20px">
        <el-form>
          <el-form-item>
            <label class="form-item-label">Account</label>
            <el-input v-model="username"></el-input>
          </el-form-item>
          <el-form-item>
            <label class="form-item-label">Password</label>
            <el-input v-model="password" type="password"></el-input>
          </el-form-item>

          <!-- <el-form-item>
            <el-select
              v-model="countrySelectItem"
              class="m-2"
              placeholder="请选择国家"
            >
              <el-option
                v-for="item in countryList"
                :key="item.Type"
                :label="item.Name"
                :value="item.Type"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button @click="Login()" type="primary" style="width: 100%"
              >Login</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </el-container>
</template>

<script setup>
import { ref, h, onMounted } from "vue";
import { LoginApi } from "../api/api";

import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const countryList = ref([
  {
    Name: "中国",
    Type: 1,
  },
  {
    Name: "香港",
    Type: 2,
  },
]);
const countrySelectItem = ref(1);

const username = ref("");
const password = ref("");

function Login() {
  localStorage.setItem("CountryType", countrySelectItem.value);

  LoginApi({
    username: username.value,
    password: password.value,
  })
    .then((rsp) => {
      // console.log(rsp.data.Code);
      if (rsp.data.Code === 1000) {

        localStorage.setItem("User",      JSON.stringify(rsp.data.Data));

   

        ElMessage({
          message: h("p", null, [
            h("i", { style: "color: teal" }, "Suessce:"),
            h("span", null, "登录成功,跳转订单管理"),
          ]),
        });
        router.push({ name: "order" });
      } else {
        ElMessage({
          message: h("p", null, [
            h("i", { style: "color: teal" }, "Error:"),
            h("span", null, rsp.data.Message),
          ]),
        });
      }
    })
    .catch((err) => {
      ElMessage({
        message: h("p", null, [
          h("i", { style: "color: teal" }, "Error:"),
          h("span", null, "非法请求"),
        ]),
      });
    });
}

onMounted(async () => {
  var type = localStorage.getItem("CountryType");
  if (type != null) {
    countrySelectItem.value = parseInt(type);
  }
});
</script>
