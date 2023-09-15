<style>
#queryBox {
  margin-bottom: 30px;
}

#queryBox #query-addr {
  margin-left: 10px;
  margin-right: 20px;
}

.demo-collapse {
  margin-bottom: 20px;
}

.mg-t {
  margin-top: 20px;
}

/* 用来对齐 */
.region-list-style /deep/ .el-checkbox + .el-checkbox {
  margin-left: 0px;
}

.region-list-style /deep/ .el-checkbox {
  margin-right: 25px;
}

/* 用来调整每一项的宽度 */
.region-list-item {
  width: 300px;
  white-space: nowrap;
  /* text-overflow: ellipsis; */
  overflow: hidden;
}
</style>

<script setup>
import { ref, h, onMounted } from "vue";
import {
  GetIphoneModelInfoListApi,
  GetShopAddrApi,
  ImportDataApi,
  GetImportDataApi,
  UploadBatchApi,
  EditTxtApi,
  DeleteTxtApi,
  GetOrderDataApi,
  GetNotifyApi,
  ClickNotifyApi,
} from "../api/api";

import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

//初始化国家 默认无
const countryType = ref(0);

const payMothodShow = ref(false);
const payMothod = ref(0);

const payMothods = ref([
  {
    PayName: "无",
    PayType: 0,
  },
  {
    PayName: "支付宝",
    PayType: 1,
  },
  {
    PayName: "微信",
    PayType: 2,
  },
]);

///存放text的输入框
const importText = ref();

const importText_placeholderObjs = ref({
  中国:
    "中国格式:" +
    "\n" +
    "姓----名----身份证号后四位" +
    "\n" +
    "张----三----4321",
  香港:
    "香港格式:" +
    "\n" +
    "firstname----lastname----billing----street" +
    "\n" +
    "Tony----Leung----CC:4725930001723364|2024|11|388----tong luowan street 34",
  日本:
    "日本格式:" +
    "\n" +
    "firstName----lastName----billing----firstNamePhonetic----lastNamePhonetic----postalCode----state----city----street" +
    "\n" +
    "中村----園絵----GC:XK73FHG2V2222222----ナカムラ----ソノエ----480-1103----愛知県----長久手市----岩作長筬3-19-808",
  所有:
    "中国格式:" +
    "\n" +
    "姓----名----身份证号后四位" +
    "\n" +
    "张----三----4321" +
    "\n \n" +
    "香港格式:" +
    "\n" +
    "firstname----lastname----billing----street" +
    "\n" +
    "Tony----Leung----CC:4725930001723364|2024|11|388----tong luowan street 34" +
    "\n \n" +
    "日本格式:" +
    "\n" +
    "firstName----lastName----billing----firstNamePhonetic----lastNamePhonetic----postalCode----state----city----street" +
    "\n" +
    "中村----園絵----GC:XK73FHG2V2222222----ナカムラ----ソノエ----480-1103----愛知県----長久手市----岩作長筬3-19-808",
});

const importText_placeholder = ref(importText_placeholderObjs.value.所有);

const getIphoneModelInfoList = ref([]);
const selectedColors = ref();
async function GetIphoneModelInfoList() {
  try {
    const rsp = await GetIphoneModelInfoListApi();

    if (rsp.data.Code === 1000) {
      console.log("我要返回了");
      return rsp.data.Data;
    } else {
      ElMessage({
        message: h("p", null, [
          h("i", { style: "color: teal" }, "Error:"),
          h("span", null, rsp.data.Message),
        ]),
      });
      throw new Error(rsp.data.Message); // 抛出错误以便调用者捕获
    }
  } catch (err) {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, "非法请求"),
      ]),
    });
    throw err; // 重新抛出错误以便调用者捕获
  }
}

const getShopAddrList = ref([]);
const getShopAddrListBack = ref([]);

const showAddr = ref(false);
const showAddrFlag = ref(true);
async function GetShopAddrList() {
  try {
    const rsp = await GetShopAddrApi({ CountryType: countryType.value });

    if (rsp.data.Code === 1000) {
      console.log("我要返回了");
      return rsp.data.Data;
    } else {
      ElMessage({
        message: h("p", null, [
          h("i", { style: "color: teal" }, "Error:"),
          h("span", null, rsp.data.Message),
        ]),
      });
      throw new Error(rsp.data.Message); // 抛出错误以便调用者捕获
    }
  } catch (err) {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, "非法请求"),
      ]),
    });
    throw err; // 重新抛出错误以便调用者捕获
  }
}

///提交资料函数
async function SubmitInformation() {
  if (showAddr.value.CountryType == 1) {
    if (payMothod.value == 0) {
      ElMessage({
        message: h("p", null, [
          h("i", { style: "color: teal" }, "Error:"),
          h("span", null, "中国需要选择支付方式"),
        ]),
      });
      return;
    }
  }

  //检查是否选了店铺地址
  if (showAddr.value === false) {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, "请选择一个店铺地址"),
      ]),
    });
  }

  //检查是否选了机型
  if (selectedColors.value.length <= 0) {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, "请至少选择一个机型"),
      ]),
    });
    return;
  }

  selectedColors.value.forEach((item) => {
    console.log(item);
    if (item.CountryType != showAddr.value.CountryType) {
      ElMessage({
        message: h("p", null, [
          h("i", { style: "color: teal" }, "Error:"),
          h("span", null, "选择的机型中不能包含多个国家"),
        ]),
      });
      error = 1;
      return;
    }
  });

  if (error == 1) {
    return;
  }

  if (importText.value == null || importText.value == "") {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, "资料不能为空"),
      ]),
    });
    return;
  }
  importText.value = importText.value.trim();
  //检查文本是否正常
  var longText = importText.value.split("\n");
  var i = 0;

  var error = 0;

  longText.forEach((item) => {
    if (item == "") {
      return;
    }
    i++;

    var fgwb = item.split("----");

    //姓----名----身份证号后四位----email----电话

    if (showAddr.value.CountryType == 1) {
      if (fgwb.length != 3) {
        error = 1;
        ElMessage({
          message: h("p", null, [
            h("i", { style: "color: teal" }, "Error:"),
            h("span", null, "第" + i + "行,存在问题。"),
          ]),
        });
        return;
      }
    }

    if (showAddr.value.CountryType == 2) {
      if (fgwb.length != 4) {
        error = 1;
        ElMessage({
          message: h("p", null, [
            h("i", { style: "color: teal" }, "Error:"),
            h("span", null, "第" + i + "行,存在问题。"),
          ]),
        });
        return;
      }
    }

    if (showAddr.value.CountryType == 3) {
      if (fgwb.length != 9) {
        error = 1;
        ElMessage({
          message: h("p", null, [
            h("i", { style: "color: teal" }, "Error:"),
            h("span", null, "第" + i + "行,存在问题。"),
          ]),
        });
        return;
      }
    }
  });
  //防止继续往下走
  if (error == 1) {
    return;
  }
  if (i <= 0) {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, "资料不能为空"),
      ]),
    });
    return;
  }

  console.log(selectedColors.value);

  var colorIds = [];

  selectedColors.value.forEach((item) => {
    colorIds.push(item.IphoneModelSizeColorId);
  });

  var postdata = {
    IPhoneModelColorIds: colorIds,
    ShopAddrId: showAddr.value.Id,
    LineTexts: longText,
    CountryType: null,
  };
  //中国需要支付方式
  if (showAddr.value.CountryType == 1) {
    postdata.PayMothod = payMothod.value;
  }

  postdata.CountryType = showAddr.value.CountryType;

  console.log(postdata);
  var rsp = await ImportDataApi(postdata);
  if (rsp.data.Code === 1000) {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Suessce:"),
        h("span", null, "成功"),
      ]),
    });
  } else {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, rsp.data.Message),
      ]),
    });
  }
  importText.value = "";
}

const getImportData = ref();
async function GetImportDataFunc() {
  var query = {};

  if (guojia.value != null && guojia.value != "") {
    query.CountryType = parseInt(guojia.value);
  } else {
    query.CountryType = 0;
  }

  var rsp = await GetImportDataApi(query);

  getImportData.value = rsp.data.Data;
}

const isDialogVisible = ref(false);
const dialogData = ref();
function ShowTable(rowData) {
  console.log(rowData.TxtInfos);

  dialogData.value = rowData; // 假设rowData中有您想要传递的子表格数据

  // console.log(dialogData.value );
  isDialogVisible.value = true;
}
//存储用户对象
const userObj = ref();

//绑定选择的地址
const selectAddr = ref("");

//查询时间区间
const queryTimeArr = ref(null);

//最外层的国家筛选绑定值
const guojia = ref();
//国家筛选器触发器
function handleSelectChange(value) {
  // 在这里处理选中的值
  console.log("Selected Value:", value);

  // 切换国家后清空这2个的值
  selectedColors.value = [];
  showAddr.value = false;

  if (value != "") {
    var valueInt = parseInt(value);

    getShopAddrList.value = getShopAddrListBack.value.filter(
      (item) => item.CountryType == valueInt
    );

    getIphoneModelInfoList.value = getIphoneModelInfoListBack.value.filter(
      (item) => item.CountryType == valueInt
    );

    //香港
    if (value == 2) {
      payMothod.value = 0;
      payMothodShow.value = false;
      importText_placeholder.value = importText_placeholderObjs.value.香港;
    }

    //中国
    if (value == 1) {
      payMothodShow.value = true;
      importText_placeholder.value = importText_placeholderObjs.value.中国;
    }

    //日本
    if (value == 3) {
      payMothod.value = 0;
      payMothodShow.value = false;
      importText_placeholder.value = importText_placeholderObjs.value.日本;
    }
  } else {
    getShopAddrList.value = getShopAddrListBack.value;
    importText_placeholder.value = importText_placeholderObjs.value.所有;
    getIphoneModelInfoList.value = getIphoneModelInfoListBack.value;
  }

  // 你可以在这里添加其他的逻辑来处理数据
}

//地址单选触发器
function shopRadioChange(value) {
  if (value.CountryType == 1) {
    payMothodShow.value = true;
  } else {
    payMothodShow.value = false;
    payMothod.value = 0;
  }
  // 在这里处理选中的值
  console.log("AAASelected Value:", value);

  // 你可以在这里添加其他的逻辑来处理数据
}

async function UploadBatchFunc(item) {
  var post = {
    BatchId: item.BatchId,
  };

  var rsp = await UploadBatchApi(post);

  if (rsp.data.Code == 1000) {
    item.IsUpload = 2;

    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Suescce:"),
        h("span", null, "上传成功"),
      ]),
    });
    return;
  } else {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, rsp.data.Message),
      ]),
    });
    return;
  }
}

const editingRow = ref(-1);

function startEditing(index) {
  console.log("你好啊");
  console.log(index);
  editingRow.value = index;
}

async function stopEditing(value) {
  console.log(value);
  editingRow.value = -1;

  var rsp = await EditTxtApi(value);

  if (rsp.data.Code == 1000) {
    value = null;
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Success:"),
        h("span", null, "成功"),
      ]),
    });
    return;
  } else {
    ElMessage({
      message: h("p", null, [
        h("i", { style: "color: teal" }, "Error:"),
        h("span", null, rsp.data.Message),
      ]),
    });
    return;
  }
}

async function DeleteLineTxt(value) {
  ElMessageBox.confirm("确定删除吗？无法恢复哦", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      var rsp = await DeleteTxtApi(value);

      if (rsp.data.Code == 1000) {
        var index = dialogData.value.TxtInfos.indexOf(value);

        if (index !== -1) {
          dialogData.value.TxtInfos.splice(index, 1); // 从数据中删除该行
        }

        ElMessage({
          message: h("p", null, [
            h("i", { style: "color: teal" }, "Success:"),
            h("span", null, "成功"),
          ]),
        });
        return;
      } else {
        ElMessage({
          message: h("p", null, [
            h("i", { style: "color: teal" }, "Error:"),
            h("span", null, rsp.data.Message),
          ]),
        });
        return;
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
}

const orderList = ref([]);
async function GetOrderDataFunc() {
  var postBody = {};

  if (selectAddr.value != "") {
    postBody.ShopAddrId = selectAddr.value;
  }
  if (queryTimeArr.value != null) {
    postBody.OrderTimes = queryTimeArr.value;
  }

  console.log(queryTimeArr);

  var rsp = await GetOrderDataApi(postBody);
  console.log(rsp.data);

  orderList.value = rsp.data.Data;

  console.log(selectAddr);
}

//导出表格
function exportExcel() {
  exportExcel2(orderList.value, "订单表");
}
function exportExcel2(JSONData, FileName) {
  if (!JSONData) return;

  //需要导出的管理
  var titlefixed = [
    {
      key: "OwnerUsername",
      value: "所属用户",
    },
    {
      key: "OrderIdno",
      value: "订单编号",
    },
    {
      key: "ClientName",
      value: "名字",
    },
    {
      key: "PickingAddress",
      value: "取货店铺",
    },
    {
      key: "PaymentAddress",
      value: "付款地址",
    },
    {
      key: "PaymentMoney",
      value: "付款金额",
    },
    {
      key: "Email",
      value: "邮箱",
    },
    {
      key: "EmailPassowrd",
      value: "邮箱密码",
    },
    {
      key: "PickingUrl",
      value: "取货链接",
    },
    {
      key: "IdCard",
      value: "身份证",
    },
    {
      key: "Model",
      value: "型号",
    },
    {
      key: "AppleId",
      value: "苹果id",
    },
    {
      key: "ApplePassWord",
      value: "苹果id密码",
    },
    {
      key: "PhoneNumber",
      value: "手机号",
    },
    {
      key: "PickingTime",
      value: "取货时间",
    },
    {
      key: "OrderTime",
      value: "订单时间",
    },
    {
      key: "PaymentMethod",
      value: "付款方式",
    },
  ];

  //转化json为object
  var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
  var excel = "<table>";
  //设置表头
  var row = "<tr>";
  if (titlefixed) {
    //使用标题项
    for (var i in titlefixed) {
      row += "<th align='center'>" + titlefixed[i].value + "</th>";
    }
  } else {
    //不使用标题项
    for (var i in arrData[0]) {
      row += "<th align='center'>" + i + "</th>";
    }
  }
  excel += row + "</tr>";
  //设置数据

  for (var j = 0; j < arrData.length; j++) {
    var row = "<tr>";

    for (var ii in titlefixed) {
      console.log();
      var item = arrData[j][titlefixed[ii].key];

      if (item != null) {
        row += "<td align='center'>" + item + "</td>";
      } else {
        row += "<td align='center'>" + "" + "</td>";
      }
    }

    excel += row + "</tr>";
  }
  excel += "</table>";
  var excelFile =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
  excelFile +=
    '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  excelFile +=
    '<meta http-equiv="content-type" content="application/vnd.ms-excel';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += "{worksheet}";
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += excel;
  excelFile += "</body>";
  excelFile += "</html>";
  var uri =
    "data:application/vnd.ms-excel;charset=utf-8," +
    encodeURIComponent(excelFile);
  var link = document.createElement("a");
  link.href = uri;
  //link.style = "visibility:hidden";
  link.download = FileName + ".xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//存放通知的对象 用于确认通知
const notifyObj = ref();
//是否有通知 决定是否播放和点击确定
const isNotify = ref(false);

const audio = new Audio("/yy.mp3");

function playAudio() {
  audio.play().catch((error) => {
    console.error("Audio play error:", error);
  });
}
// 当音频播放结束时的事件
audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  audio.play();
});

//获取通知
async function getMyNotify() {
  var rsp = await GetNotifyApi({});

  if (rsp.data.Data != null) {
    console.log("通知来了");
    console.log(rsp.data.Data);

    if (isNotify.value == false) {
      isDialogVisibleByNotify.value = true;
      isNotify.value = true;

      notifyObj.value = rsp.data.Data;
      playAudio();
    }
  }
}

//处理通知
async function ClickNotify() {
  var rsp = await ClickNotifyApi({
    NotifyId: notifyObj.value.Id,
  });

  if (rsp.data.Data == true) {
    isNotify.value = false;
    audio.pause();
    audio.currentTime = 0;
    isDialogVisibleByNotify.value=false;
  }
}

//配置通知的一些定时器
function StartNotifyFunc() {
  setInterval(getMyNotify, 3000);
}
//通知的遮罩层
const isDialogVisibleByNotify = ref(false);
// 机型的副本存储  根据选择国家不同来切换
const getIphoneModelInfoListBack = ref();
onMounted(async () => {
  try {
    console.log("启动定时检查任务");
    StartNotifyFunc();
    guojia.value = "";
    countryType.value = parseInt(localStorage.getItem("CountryType"));

    getIphoneModelInfoList.value = await GetIphoneModelInfoList();
    getIphoneModelInfoListBack.value = getIphoneModelInfoList.value;

    getShopAddrListBack.value = await GetShopAddrList();
    getShopAddrList.value = getShopAddrListBack.value;

    //  userObj.value=    localStorage.getItem("User");

    userObj.value = JSON.parse(localStorage.getItem("User"));

    //获取新的时间
    let date = new Date();
    //获取当前时间的年份转为字符串
    let year = date.getFullYear().toString();
    //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString();
    //获取天，判断是否小于10，如果是在字符串前面拼接'0'
    let da =
      date.getDate() < 10
        ? "0" + date.getDate().toString()
        : date.getDate().toString();
    //字符串拼接，开始时间，结束时间
    let end = year + "-" + month + "-" + da; //当天
    let beg = year + "-" + month + "-" + da; //当月第一天

    queryTimeArr.value = [beg, end]; //将值设置给插件绑定的数据

    console.log("打印时间");
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
});
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-header>
       
      </el-header> -->

      <el-main>
        <div class="demo-collapse">
          <div>
            <span>
              <el-select
                v-model="guojia"
                clearable
                placeholder="管理员国家筛选器"
                @change="handleSelectChange"
              >
                <el-option key="1" label="中国" value="1" />
                <el-option key="2" label="香港" value="2" />
                <el-option key="2" label="日本" value="3" />
                <el-option key="3" label="所有" value="" />
              </el-select>
            </span>
          </div>

          <el-collapse>
            <el-collapse-item title="提交资料" name="1">
              <div
                v-for="model in getIphoneModelInfoList"
                :key="model.IPhoneModelId"
              >
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <span>{{ model.IPhoneModelName }}</span>
                    </div>
                  </template>

                  <div
                    v-for="sizeObj in model.IPhoneModelSizeInfos"
                    :key="sizeObj.IPhoneModelSizeId"
                    style="
                      display: inline-block;
                      margin: 10px 20px;
                      border: solid 1px red;
                      border-radius: 5px;
                    "
                  >
                    <span style="padding: 0 5px">
                      <el-tag class="ml-2" type="success"
                        >{{ sizeObj.IPhoneModelSizeG }}</el-tag
                      >

                      <el-checkbox-group
                        v-model="selectedColors"
                        style="display: inline-block; margin-left: 10px"
                      >
                        <el-checkbox
                          v-for="colorObj in sizeObj.IPhoneModelSizeColorInfos"
                          :key="colorObj.IphoneModelSizeColorId"
                          :label="colorObj"
                        >
                          {{ colorObj.IphoneModelSizeColorName }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </span>
                  </div>
                </el-card>
              </div>

              <!-- 机型控制 -->
              <!-- <div>
                <el-tabs
                  v-model="activeName"
                  class="demo-tabs"
                  @tab-click="handleClick"
                >
                  <el-tab-pane label="中国" name="first">中国</el-tab-pane>
                  <el-tab-pane label="香港" name="second">香港</el-tab-pane>
                  <el-tab-pane label="日本" name="third">日本</el-tab-pane>
                </el-tabs>
              </div> -->
              <!-- 其他组件 -->

              <el-card class="box-card mg-t">
                <div v-show="showAddrFlag">
                  <el-button
                    type="primary"
                    @click="showAddrFlag = !showAddrFlag"
                    v-if="getShopAddrList.length > 10"
                    >{{ showAddrFlag ? "隐藏" : "显示" }}
                  </el-button>

                  <el-radio-group v-model="showAddr" class="ml-4">
                    <el-radio
                      v-for="showAddrObj in getShopAddrList"
                      :key="showAddrObj"
                      :label="showAddrObj"
                      class="region-list-item"
                      :title="showAddrObj"
                      size="large"
                      @change="shopRadioChange"
                      >{{ showAddrObj.ShopCodeAndAddr }}</el-radio
                    >
                  </el-radio-group>
                </div>

                <el-button
                  type="primary"
                  @click="showAddrFlag = !showAddrFlag"
                  v-if="getShopAddrList.length > 10"
                  >{{ showAddrFlag ? "隐藏" : "显示" }}</el-button
                >
              </el-card>

              <!-- 支付方式 -->
              <el-select
                v-model="payMothod"
                placeholder="支付方式"
                style="width: 240px"
                v-if="payMothodShow == true"
              >
                <el-option
                  v-for="item in payMothods"
                  :key="item.PayType"
                  :label="item.PayName"
                  :value="item.PayType"
                />
              </el-select>

              <!-- 其他组件 -->

              <el-input
                v-model="importText"
                :rows="15"
                type="textarea"
                :placeholder="importText_placeholder"
                class="mg-t"
              />

              <!-- 其他组件 -->
              <el-button
                type="primary"
                class="mg-t"
                @click="SubmitInformation()"
                >提交资料</el-button
              >
            </el-collapse-item>

            <el-collapse-item title="资料查看" name="2">
              <el-button type="primary" @click="GetImportDataFunc()">
                查询</el-button
              >

              <el-table :data="getImportData" border style="width: 100%">
                <el-table-column prop="address" label="序号" width="60">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>

                <el-table-column prop="date2" label="导入人" width="120">
                  <template #default="scope">
                    {{ scope.row.OwnerUsername }}
                  </template>
                </el-table-column>

                <el-table-column prop="date" label="国家" width="120">
                  <template #default="scope">
                    {{ scope.row.CountryStr }}
                  </template>
                </el-table-column>

                <el-table-column prop="date" label="支付方式" width="120">
                  <template #default="scope">
                    {{
                      scope.row.PayMothod == 0
                        ? "无"
                        : scope.row.PayMothod == 1
                        ? "支付宝"
                        : "微信"
                    }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="date"
                  label="店铺地址详细"
                  width="180"
                  :show-overflow-tooltip="true"
                >
                  <template #default="scope">
                    {{ scope.row.ShopAddrObj.ShopCodeAndAddr }}
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="机型" width="380">
                  <template #default="scope">
                    <el-tag
                      class="ml-2"
                      type="success"
                      v-for="iphoneObj in scope.row.IPhoneInfos"
                      :key="iphoneObj.IPhoneColorObj.Id"
                      style="margin-right: 10px; margin-top: 5px"
                    >
                      <el-tag class="ml-2" type="info">{{
                        iphoneObj.IPhoneColorObj.UnCode
                      }}</el-tag>

                      {{
                        iphoneObj.IPhoneObj.ModelName +
                        " " +
                        iphoneObj.IPhoneSizeObj.SizeG +
                        "G" +
                        iphoneObj.IPhoneColorObj.ColorName
                      }}</el-tag
                    >
                  </template>
                </el-table-column>

                <el-table-column prop="date" label="数据" width="180">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="ShowTable(scope.row)"
                    >
                      查看数据
                    </el-button>
                  </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="120">
                  <template #default="scope">
                    <span v-if="scope.row.IsUpload === 1">正在上传</span>
                    <span v-if="scope.row.IsUpload === 2">已上传</span>
                    <el-button
                      v-if="scope.row.IsUpload == 0"
                      link
                      type="primary"
                      size="small"
                      @click.prevent="UploadBatchFunc(scope.row)"
                    >
                      上传
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>

            <el-collapse-item title="订单列表" name="3">
              <div id="queryBox">
                <el-button type="primary" @click="exportExcel()">
                  导出</el-button
                >

                <el-button type="primary" @click="GetOrderDataFunc()">
                  查询</el-button
                >

                <span id="query-addr"
                  >地址:

                  <el-select
                    v-model="selectAddr"
                    clearable
                    placeholder="地址选择器"
                  >
                    <el-option
                      v-for="item in getShopAddrList"
                      :key="item.Id"
                      :label="item.ShopCodeAndAddr"
                      :value="item.Id"
                    />
                  </el-select>
                </span>

                <span
                  >时间范围:

                  <el-date-picker
                    v-model="queryTimeArr"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    size="default"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD  "
                    :default-value="[
                      new Date(2023, 9, 1),
                      new Date(2023, 9, 1),
                    ]"
                  />
                </span>
              </div>

              <el-table
                :data="orderList"
                border
                style="width: 100%"
                id="out-table"
                :row-style="selectedHighlight"
                :row-class-name="tableRowClassName"
                @row-click="rowClick"
              >
                <el-table-column prop="OrderId" label="序号" width="100">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="UserName" label="拥有者" width="100">
                  <template #default="scope">
                    <span>{{ scope.row.OwnerUsername }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="OrderIdno" label="订单编号" width="100">
                  <template #default="scope">
                    <span>{{ scope.row.OrderIdno }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="ClientName" label="名字" width="100">
                  <template #default="scope">
                    <span>{{ scope.row.ClientName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PickingAddress"
                  label="取货店铺"
                  width="100"
                >
                  <template #default="scope">
                    <span>{{ scope.row.ShopAddr }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PaymentAddress"
                  label="付款地址"
                  width="100"
                >
                  <template #default="scope">
                    <div style="display: flex; align-items: center">
                      <el-link type="primary">
                        <a :href="scope.row.PaymentAddress" target="_blank"
                          >打开</a
                        >
                      </el-link>
                    </div>
                  </template> </el-table-column
                >>

                <el-table-column
                  prop="PaymentMoney"
                  label="付款金额"
                  width="100"
                >
                  <template #default="scope">
                    <span>{{ scope.row.PaymentMoney }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PaymentMethod"
                  label="付款方式"
                  width="100"
                >
                  <template #default="scope">
                    <span>{{ scope.row.PaymentMethod }}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="Email" label="邮箱" width="100">
                  <template #default="scope">
                    <span>{{ scope.row.Email }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="EmailPassowrd" label="密码" width="100">
                  <template #default="scope">
                    <span>{{ scope.row.EmailPassowrd }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="PickingUrl" label="取货链接" width="100">
                  <template #default="scope">
                    <div style="display: flex; align-items: center">
                      <el-link type="primary">
                        <a :href="scope.row.PickingUrl" target="_blank">打开</a>
                      </el-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="GoodsStatus"
                  label="订单状态"
                  width="140"
                >
                <template #default="scope">

                  <el-tag class="ml-2" type="success">{{ scope.row.GoodsStatus }}</el-tag>
                   
                  </template>
              
              </el-table-column>



                <el-table-column prop="IdCard" label="身份证" width="100" />
                <el-table-column prop="Model" label="型号" width="100" />
                <el-table-column prop="AppleId" label="苹果id" width="100" />
                <el-table-column
                  prop="ApplePassWord"
                  label="苹果id密码"
                  width="100"
                />
                <el-table-column
                  prop="PhoneNumber"
                  label="手机号码"
                  width="100"
                />
                <el-table-column
                  prop="PickingTime"
                  label="取货时间"
                  width="100"
                />
                <el-table-column
                  prop="OrderTime"
                  label="订单时间"
                  width="100"
                />
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-main>
    </el-container>

    <div v-if="isDialogVisible" class="centered-dialog" style="height: 80%">
      <el-button
        type="primary"
        size="small"
        @click="isDialogVisible = !isDialogVisible"
      >
        关闭
      </el-button>

      <el-table
        :data="dialogData.TxtInfos"
        border
        style="width: 100%; height: 95%"
      >
        <el-table-column prop="address" label="序号" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- 
        <el-table-column prop="date" label="行数据">
          <template #default="scope">
            {{ scope.row.LineTxt }}
          </template>
        </el-table-column> -->

        <el-table-column prop="date" label="姓" width="100">
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.FirstName"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.FirstName }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="date" label="名" width="100">
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.LastName"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.LastName }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="身份证后4位"
          v-if="dialogData.CountryType == 1"
        >
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.CardH4"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.CardH4 }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="date" label="邮箱">
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.Email"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.Email }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="手机号">
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.PhoneNumber"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.PhoneNumber }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="Billing"
          v-if="dialogData.CountryType == 2 || dialogData.CountryType == 3"
        >
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.Billing"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.Billing }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="FirstNamePhonetic"
          v-if="dialogData.CountryType == 3"
        >
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.FirstNamePhonetic"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.FirstNamePhonetic }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="LastNamePhonetic"
          v-if="dialogData.CountryType == 3"
        >
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.LastNamePhonetic"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.LastNamePhonetic }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="PostalCode"
          v-if="dialogData.CountryType == 3"
        >
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.PostalCode"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.PostalCode }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="State"
          v-if="dialogData.CountryType == 3"
        >
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.State"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.State }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="City"
          v-if="dialogData.CountryType == 3"
        >
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.City"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.City }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          label="Street"
          v-if="dialogData.CountryType == 2 || dialogData.CountryType == 3"
        >
          <template #default="scope">
            <div v-if="editingRow === scope.$index">
              <el-input v-model="scope.row.Street"> </el-input>
            </div>

            <!-- 如果不是编辑状态，显示普通文本并添加双击事件 -->
            <span v-else @dblclick="startEditing(scope.$index)">
              {{ scope.row.Street }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="date" label="操作" fixed="right">
          <template #default="scope">
            <span>
              <el-button
                v-if="editingRow != scope.$index"
                @click="startEditing(scope.$index)"
                >编辑</el-button
              >

              <el-button
                v-if="editingRow === scope.$index"
                @click="stopEditing(scope.row)"
                >保存</el-button
              ></span
            >
          </template>
        </el-table-column>

        <el-table-column prop="date" label="操作" fixed="right">
          <template #default="scope">
            <span>
              <el-button @click="DeleteLineTxt(scope.row)"
                >删除</el-button
              ></span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 背景遮罩，当对话框显示时也显示 -->
    <div v-if="isDialogVisible" class="overlay"></div>

    <!-- 背景遮罩，当对话框显示时也显示 -->
    <div v-if="isDialogVisibleByNotify" class="overlay"></div>

    <div
      v-if="isDialogVisibleByNotify"
      class="centered-dialog"
      style="height: 80%"
    >
      <h1>您有新的订单来了 请你立刻马上处理。点击确定后，查询订单并处理。</h1>

      <el-button
        type="primary"
        style="height: 80%; width: 100%"
        @click="ClickNotify()"
        >确认处理</el-button
      >
    </div>
  </div>
</template>

<style scoped>
.el-table .cell {
  min-height: 30px;
}
.centered-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000; /* Ensure it's on top */
  width: 80%; /* or whatever width you want */
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black */
  z-index: 999; /* Under the dialog but above everything else */
}
</style>
