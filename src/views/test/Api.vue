<template>
  <div class="dashboard-container">
    <!--<div class="dashboard-text">name:{{ name }}</div>-->
    <!--<div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->

    <template>
      <section>



        <div class="return-list">
          <el-button  plain size="medium" @click="fastTest" :loading="loadingSend">模拟请求</el-button>
          <el-button  type="primary" size="medium" @click="SaveTest">保存接口</el-button>
        </div>

        <el-form :model="form" ref="form" :rules="formRules" label-width="100px" size="mini">

          <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
            <el-form-item label="所属项目：">
              <el-cascader
                placeholder="试试搜索：指南"
                :options="options"
                filterable
                change-on-select
              ></el-cascader>
            </el-form-item>
            <el-form-item label="接口名称：">
                  <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="请求方法：">
              <el-select v-model="form.methods" placeholder="Method" @change="checkRequest">
                <el-option v-for="(item,index) in methods" :key="index+''" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求地址：">
                  <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
          </div>
          <el-row :span="24">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="请求头部" name="1">
                <el-table :data="form.head" highlight-current-row ref="multipleHeadTable">
                  <el-table-column type="selection" min-width="5%" label="头部">
                  </el-table-column>
                  <el-table-column prop="name" label="Name" min-width="20%">
                    <template slot-scope="scope">
<!--                      <el-select placeholder="标签" filterable v-model="scope.row.name">
                        <el-option v-for="(item,index) in header" :key="index+''" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <!--<el-input class="selectInput" v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入标签"></el-input>-->
                      <el-input  v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入标签"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="Value" min-width="40%">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.value" :value="scope.row.value" placeholder="请输入内容"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="7%">
                    <template slot-scope="scope">
                      <i class="el-icon-delete" style="font-size:30px;cursor:pointer;" @click="delHead(scope.$index)"></i>
                    </template>
                  </el-table-column>
                  <el-table-column label="" min-width="10%">
                    <template slot-scope="scope">
                      <el-button v-if="scope.$index===(form.head.length-1)" size="mini" class="el-icon-plus" @click="addHead"></el-button>
                    </template>
                  </el-table-column>
                  <el-table-column min-width="18%">

                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item title="请求参数" name="2">
                <div style="margin: 5px">
                  <el-row :span="24">
                    <el-col :span="4"><el-radio v-model="radio" label="form-data">Parameters</el-radio></el-col>
                    <el-col :span="4"><el-radio v-model="radio" label="raw" v-if="formchange">Body Data</el-radio></el-col>
                    <!--<el-col v-show="formchange" :span="16"><el-checkbox v-model="radioType" label="3" v-show="ParameterType">表单转源数据</el-checkbox></el-col>-->
                  </el-row>
                </div>
                <el-table ref="multipleParameterTable" :data="form.parameter" highlight-current-row :class="ParameterType? 'parameter-a': 'parameter-b'" @selection-change="selsChangeParameter">
                  <el-table-column type="selection" min-width="5%" label="头部">
                  </el-table-column>
                  <el-table-column prop="name" label="Name" min-width="20%">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入参数名"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="Value" min-width="40%">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.value" :value="scope.row.value" placeholder="请输入参数值"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="7%">
                    <template slot-scope="scope">
                      <i class="el-icon-delete" style="font-size:30px;cursor:pointer;" @click="delParameter(scope.$index)"></i>
                    </template>
                  </el-table-column>
                  <el-table-column label="" min-width="10%">
                    <template slot-scope="scope">
                      <el-button v-if="scope.$index===(form.parameter.length-1)" size="mini" class="el-icon-plus" @click="addParameter"></el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="" min-width="18%"></el-table-column>
                </el-table>
                <template>
                  <el-input :class="ParameterType? 'parameter-b': 'parameter-a'" type="textarea" :rows="5" placeholder="请输入内容" v-model.trim="form.parameterRaw"></el-input>
                </template>
              </el-collapse-item>
              <el-collapse-item title="响应结果" name="4">

                <div style="margin-bottom: 10px">
                  <el-button @click="showBody">request</el-button>
                  <el-button @click="showHeader">response data</el-button>
                </div>

                <el-card class="box-card">

                  <div v-show="form.statusCode">
                    状态码：<pre>{{form.statusCode}}</pre> <br/>
                    响应头部：<pre>{{form.resultHead}}</pre>
                  </div>

                  <div v-model="form.resultData" v-show="form.resultData">
                    响应内容：<pre>{{form.resultData}}</pre>
                  </div>

                  <div v-show="!form.resultData&&!form.resultHead" class="raw">暂无数据</div>


                </el-card>



                <!--<el-card class="box-card">
                  &lt;!&ndash;<div slot="header" class="clearfix">&ndash;&gt;
                  <span v-model="form.statusCode" style="font-size: 25px">{{form.statusCode}}</span>
                  &lt;!&ndash;</div>&ndash;&gt;
                  <div v-model="form.resultData" :class="resultShow? 'parameter-a': 'parameter-b'" v-show="!format">
                    <div style="word-break: break-all;overflow:auto;overflow-x:hidden">{{form.resultData}}</div>
                  </div>
                  <div v-model="form.resultHead" :class="resultShow? 'parameter-b': 'parameter-a'">{{form.resultHead}}</div>
                  <div :class="resultShow? 'parameter-a': 'parameter-b'" v-show="format && form.resultData">
                    <pre style="border: 1px solid #e6e6e6;word-break: break-all;overflow:auto;overflow-x:hidden">{{form.resultData}}</pre>
                  </div>
                  <div v-show="!form.resultData&&!form.resultHead" class="raw">暂无数据</div>
                </el-card>-->
              </el-collapse-item>
            </el-collapse>
          </el-row>
        </el-form>


      </section>
    </template>



  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {

    const validHttp =(rule,value,callback)=>{
      if(!value){
        callback(new Error('请输入URL地址'))
      }else if(value.indexOf("http://") !==0 && value.indexOf("https://") !==0){
        callback(new Error('请输入正确的URL地址'))
      }else{
        callback()
      }

    }

    return {
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      methods: [
        {value: 'get', label: 'GET'},
        {value: 'post', label: 'POST'},
        // {value: 'put', label: 'PUT'},
        // {value: 'delete', label: 'DELETE'}
        ],
      ParameterType: true,
      radio: "form-data",
      loadingSend: false,
      /*header: [
        {value: 'Accept', label: 'Accept'},
        {value: 'Cookie', label: 'Cookie'},
        {value: 'Content-Type', label: 'Content-Type'},
        {value: 'Origin', label: 'Origin'},
        {value: 'User-Agent', label: 'User-Agent'},
        ],*/
      radioType: "",
      result: true,
      activeNames: ['1', '2', '3', '4'],
      formchange: true,
      form: {
        url:"",
        methods: 'GET',
        addr: '',
        head: [
          {name: "", value: ""},
          {name: "", value: ""}
          ],
        parameterRaw: "",
        parameter: [
          {name: "", value: ""},
          {name: "", value: ""}
          ],
        paramstype: "",
        statusCode: "",
        resultData: "",
        resultHead: "",
      },
      formRules: {
        addr: [
          { required: true, message: '请输入URL地址', trigger: 'blur' },
          { required: true, validator: validHttp, trigger: 'blur' },
        ]
      },
      headers: "",
      parameters: "",
      resultShow: true,
      format: false,
    }
  },
  methods: {
    isJsonString(str) {
        try {
          if (typeof JSON.parse(str) === "object") {
            return true;
          }
        } catch(e) {
        }
        return false;
    },
/*    changeRaw(){
      for (let i = 0; i < this.form.parameter.length; i++) {
        var a = this.form.parameter[i]["name"];
        if (a) {
          _parameter[a] = this.form.parameter[i]["value"];
        }
      }
      if(_parameter){
        _parameter = JSON.stringify(_parameter)
      }
    },
    changeFormdata(){
      if (!self.isJsonString(self.form.parameterRaw)) {

        self.$message({
          message: '格式转换错误',
          center: true,
          type: 'error'
        })

      }else{
        for (let i = 0; i < self.form.parameterRaw.length; i++) {
          this.form.parameter.push()
        }
      }

    },*/
    checkRequest(){
      let request = this.form.methods;
      if (request==="GET" || request==="DELETE"){
        this.formchange=false
      } else {
        this.formchange=true
      }
    },
    toggleHeadSelection(rows) {
      rows.forEach(row => {
        this.$refs.multipleHeadTable.toggleRowSelection(row, true);
      });
    },
    toggleParameterSelection(rows) {
      rows.forEach(row => {
        this.$refs.multipleParameterTable.toggleRowSelection(row, true);
      });
    },
    selsChangeHead: function (sels) {
      this.headers = sels
    },
    selsChangeParameter: function (sels) {
      this.parameters = sels
    },
    commonTest(url){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loadingSend = true;
          let _headers = new Object();
          let _parameter = new Object();
          this.form.statusCode = '';
          this.form.resultData = '';
          this.form.resultHead = '';

          for (let i = 0; i < this.form.head.length; i++) {
            var a = this.form.head[i]["name"];
            if (a) {
              _headers[a] = this.form.head[i]["value"]
            }
          }
          if(_headers){
            _headers = JSON.stringify(_headers)
          }

          let _type = this.radio;
          if (_type === 'form-data') {
            for (let i = 0; i < this.form.parameter.length; i++) {
              var a = this.form.parameter[i]["name"];
              if (a) {
                _parameter[a] = this.form.parameter[i]["value"];
              }
            }
            if(_parameter){
              _parameter = JSON.stringify(_parameter)
            }
            this.form.paramstype = "from"
          }

          if (this.form.parameterRaw && _type === "raw") {
            _parameter = this.form.parameterRaw
            this.form.paramstype = "raw"
          }

          this.$axios.post(url, {
            'method': this.form.methods,
            'url':  this.form.addr,
            'headers': _headers,
            'body': _parameter,
            'paramstype': this.form.paramstype
          }).then(response => {

            this.loadingSend = false
            console.log(response)
            this.form.statusCode = response.data.data.code
            this.form.resultHead = response.data.data.headers
            this.form.resultData = response.data.data.content
//            this.form.resultData = JSON.stringify(JSON.parse(response.data.data.content), null, 5);
          }).catch(error => {

            this.loadingSend = false
            console.log(error)
            this.form.statusCode = error.code
            this.form.resultHead = error.headers
            this.form.resultData = error

          })
        }
      })
    },
    fastTest: function() {
      this.commonTest('/api/test')
    },
    SaveTest(){
      this.commonTest('/api/save')
    },
    neatenFormat() {
      /*let demo = document.getElementsByTagName('pre')[0];
      console.log(demo)
      hljs.highlightBlock(demo);
      this.format = !this.format*/
    },
    addHead() {
      let headers = {name: "", value: ""};
      this.form.head.push(headers);
      let rows = [this.form.head[this.form.head.length-1]];
      this.toggleHeadSelection(rows)
    },
    delHead(index) {
      if (this.form.head.length !== 1) {
        this.form.head.splice(index, 1)
      }
    },
    addParameter() {
      let headers = {name: "", value: "", required:"True", restrict: "", description: ""};
      this.form.parameter.push(headers);
      let rows = [this.form.parameter[this.form.parameter.length-1]];
      this.toggleParameterSelection(rows)
    },
    delParameter(index) {
      if (this.form.parameter.length !== 1) {
        this.form.parameter.splice(index, 1)
      }
    },
    addResponse() {
      let headers = {name: "", value: "", required:"True", restrict: "", description: ""};
      this.form.response.push(headers)
    },
    delResponse(index) {
      if (this.form.response.length !== 1) {
        this.form.response.splice(index, 1)
      }
    },
    showBody() {
      this.resultShow = true
    },
    showHeader() {
      this.resultShow = false
    },
    changeParameterType() {
      if (this.radio === 'form-data') {
        this.ParameterType = !this.ParameterType
      } else {
        this.ParameterType = !this.ParameterType
      }
    },
    handleChange(val) {
    },
    onSubmit() {
      console.log('submit!');
    },
  },
  watch: {
    radio() {
      this.changeParameterType()
    }
  },
  mounted() {
    this.toggleHeadSelection(this.form.head);
    this.toggleParameterSelection(this.form.parameter);
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.return-list {
  margin-top: 0px;
  margin-bottom: 10px;
  /*border-radius: 25px;*/
}
.head-class {
  font-size: 17px
}
.parameter-a {
  display: block;
}
.parameter-b {
  display: none;
}
.selectInput {
  position: absolute;
  padding-left: 9px;
  width: 180px;
  left: 1px;
  border-right: 0px;
}
.raw {
  border: 1px solid #e6e6e6;
  margin-bottom: 10px;
  padding:15px;
  text-align: center
}
.HOST {
  position: absolute;
  right: 10px;
  top: 0px;
}
</style>
<style lang="scss">
  .selectInput{
    input{
      border-right: 0px;
      border-radius: 4px 0px 0px 4px;
    }
  }
  .el-input__inner {
    height: 30px;
    line-height: 40px;
  }
  .el-table td, .el-table th{
    padding: 4px 0;
  }
  .el-collapse-item__header{
    height: 30px;
    line-height: 30px;
    font-size: 15px;
  }
</style>
