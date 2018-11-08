<template>
  <div class="dashboard-container">
    <!--<div class="dashboard-text">name:{{ name }}</div>-->
    <!--<div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->

    <template>
      <section>

        <div class="return-list">
          <el-button  plain size="medium" @click="fastTest" :loading="loadingSend">模拟请求</el-button>
          <el-button  type="primary" size="medium">保存接口</el-button>
        </div>

        <el-form :model="form" ref="form" :rules="formRules">
          <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-form-item>
                  <el-select v-model="form.methods" placeholder="请求方式" @change="checkRequest">
                    <el-option v-for="(item,index) in methods" :key="index+''" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span='21'>
                <el-form-item prop="addr">
                  <el-input v-model.trim="form.addr" placeholder="请输入URL地址" auto-complete></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row :span="24">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="请求头部" name="1">
                <el-table :data="form.head" highlight-current-row ref="multipleHeadTable">
                  <el-table-column type="selection" min-width="5%" label="头部">
                  </el-table-column>
                  <el-table-column prop="name" label="标签" min-width="20%" sortable>
                    <template slot-scope="scope">
<!--                      <el-select placeholder="标签" filterable v-model="scope.row.name">
                        <el-option v-for="(item,index) in header" :key="index+''" :label="item.label" :value="item.value"></el-option>
                      </el-select>-->
                      <!--<el-input class="selectInput" v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入标签"></el-input>-->
                      <el-input  v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入标签"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="内容" min-width="40%" sortable>
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
                    <el-col :span="4"><el-radio v-model="radio" label="form-data">表单(form-data)</el-radio></el-col>
                    <el-col :span="4"><el-radio v-model="radio" label="raw" v-if="formchange">源数据(raw)</el-radio></el-col>
                    <!--<el-col v-show="formchange" :span="16"><el-checkbox v-model="radioType" label="3" v-show="ParameterType">表单转源数据</el-checkbox></el-col>-->
                  </el-row>
                </div>
                <el-table ref="multipleParameterTable" :data="form.parameter" highlight-current-row :class="ParameterType? 'parameter-a': 'parameter-b'" @selection-change="selsChangeParameter">
                  <el-table-column type="selection" min-width="5%" label="头部">
                  </el-table-column>
                  <el-table-column prop="name" label="参数名" min-width="20%" sortable>
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.name" :value="scope.row.name" placeholder="请输入参数名"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" label="参数值" min-width="40%" sortable>
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
                  <el-button @click="showBody">Body</el-button>
                  <el-button @click="showHeader">Head</el-button>
                  <el-button type="primary" @click="neatenFormat">格式转换</el-button>
                </div>
                <el-card class="box-card">
                  <!--<div slot="header" class="clearfix">-->
                    <span v-model="form.statusCode" style="font-size: 25px">{{form.statusCode}}</span>
                  <!--</div>-->
                  <div v-model="form.resultData" :class="resultShow? 'parameter-a': 'parameter-b'" v-show="!format">
                    <div style="word-break: break-all;overflow:auto;overflow-x:hidden">{{form.resultData}}</div>
                  </div>
                  <div v-model="form.resultHead" :class="resultShow? 'parameter-b': 'parameter-a'">{{form.resultHead}}</div>
                  <div :class="resultShow? 'parameter-a': 'parameter-b'" v-show="format && form.resultData">
                    <pre style="border: 1px solid #e6e6e6;word-break: break-all;overflow:auto;overflow-x:hidden">{{form.resultData}}</pre>
                  </div>
                  <div v-show="!form.resultData&&!form.resultHead" class="raw">暂无数据</div>
                </el-card>
              </el-collapse-item>
            </el-collapse>
          </el-row>
        </el-form>
      </section>
    </template>



  </div>
</template>

<script>
import request from '@/utils/request'

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
      methods: [
        {value: 'get', label: 'GET'},
        {value: 'post', label: 'POST'},
        {value: 'put', label: 'PUT'},
        {value: 'delete', label: 'DELETE'}
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
        methods: 'POST',
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
    fastTest: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loadingSend = true;
          let _parameter = new Object();
          let _headers = new Object();
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
          }

          if (this.form.parameterRaw && _type === "raw") {
            _parameter = this.form.parameterRaw
          }

          this.$axios.post('/interface/test', {
            'method': this.form.methods,
            'url':  this.form.addr,
            'headers': _headers,
            'body': _parameter
          }).then(response => {

            this.loadingSend = false
            console.log(response)
            this.form.statusCode = response.status + ' ' + response.statusText
            this.form.resultData = response.data
            this.form.resultHead = response.headers

          }).catch(error => {

            this.loadingSend = false
            console.log(error)
            this.form.statusCode = error.status
            this.form.resultData = error.data
            this.form.resultHead = error.headers

          })
        }
      })
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
    changeParameterType() {
      if (this.radio === 'form-data') {
        this.ParameterType = !this.ParameterType
      } else {
        this.ParameterType = !this.ParameterType
      }
    },
    showBody() {
      this.resultShow = true
    },
    showHeader() {
      this.resultShow = false
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
</style>
