<template>
  <div class="dashboard-container">

    <template>
      <section>

        <el-row :gutter="24">
          <el-col :span="12">
            <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px">

              <div class="return-list">
                <el-button  plain size="medium" @click="fastTest" :loading="loadingSend">模拟请求</el-button>
                <el-button  type="primary" size="medium" :loading="loadingSave" @click="SaveTest">保存接口</el-button>
              </div>

              <el-form :model="form" ref="form" :rules="formRules" label-width="100px">

                  <el-form-item label="所属项目：" prop="selectedOptions3">
                    <el-cascader
                      placeholder="搜索：  用户项目"
                      :options="options"
                      v-model="form.selectedOptions3"
                      @change="handleOptionsChange"
                      filterable
                      change-on-select></el-cascader>
                  </el-form-item>
                  <el-form-item label="接口名称：" prop="name">
                        <el-input v-model="form.name" placeholder="请输入接口名称"></el-input>
                  </el-form-item>
                  <el-form-item label="请求方法：" prop="methods">
                    <el-select v-model="form.methods" placeholder="Method" @change="checkRequest">
                      <el-option v-for="(item,index) in methods" :key="index+''" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="请求地址：" prop="addr">
                        <el-input type="textarea" v-model="form.addr" :rows="4" placeholder="请输入请求地址"></el-input>
                  </el-form-item>

                  <el-row :span="24">
                    <el-collapse v-model="activeNames" @change="handleChange">
                      <el-collapse-item title="请求头部" name="1">
                        <el-table :data="form.head" highlight-current-row ref="multipleHeadTable">
                          <el-table-column prop="name" label="Name" min-width="20%">
                            <template slot-scope="scope">
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
                            <el-col :span="8"><el-radio v-model="radio" label="form-data">Parameters</el-radio></el-col>
                            <el-col :span="8"><el-radio v-model="radio" label="raw" v-if="formchange">Body Data</el-radio></el-col>
                          </el-row>
                        </div>
                        <el-table ref="multipleParameterTable" :data="form.parameter" highlight-current-row :class="ParameterType? 'parameter-a': 'parameter-b'" @selection-change="selsChangeParameter">
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
                          <el-input :class="ParameterType? 'parameter-b': 'parameter-a'" type="textarea" :rows="7" placeholder="请输入请求参数" v-model.trim="form.parameterRaw"></el-input>
                        </template>
                      </el-collapse-item>
                    </el-collapse>
                  </el-row>

              </el-form>

            </div>
          </el-col>

          <el-col :span="12">
            <div style="border: 1px solid #e6e6e6;margin-bottom: 10px;padding:15px;padding-bottom: 0px;">

              <div style="margin-bottom: 10px">
                <el-button @click="showRequest">request</el-button>
                <el-button @click="showResponse">response data</el-button>
              </div>
              <el-card class="box-card">
                <div v-show="resultShow">
                  <div style="min-height: 655px">
                    请求头部：<pre>{{ reqheaders }}</pre>
                    请求地址：<pre>{{ reqaddr }}</pre>
                    请求参数：<pre>{{ reqbody }}</pre>
                  </div>
                </div>
                <div  v-show="!resultShow">
                  <div style="min-height: 655px;">
                    响应状态码：<pre>{{form.statusCode}}</pre>
                    响应头部：<pre>{{form.resultHead}}</pre>
                    响应cookies：<pre>{{form.resultCookies}}</pre>
                    响应内容：<pre>{{form.resultData}}</pre>
                  </div>
                </div>
              </el-card>

            </div>
          </el-col>
        </el-row>

      </section>
    </template>

  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {

    const validProjectName = (rule, value, callback) => {
      if(!this.load){
        if(!value){
          callback(new Error('请输入接口名称'))
        }else {
          callback()
        }
      }else {
        callback()
      }
    }
    const validProject = (rule, value, callback) => {
      if(!this.load){
        debugger
        if(value.length === 0){
          callback(new Error('请选择所属项目'))
        }else {
          callback()
        }
      }else {
        callback()
      }
    }
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
      options: [],
      methods: [
        {value: 'get', label: 'GET'},
        {value: 'post', label: 'POST'},
        // {value: 'put', label: 'PUT'},
        // {value: 'delete', label: 'DELETE'}
        ],
      ParameterType: true,
      radio: "form-data",
      load:true,
      loadingSend: false,
      loadingSave: false,
      radioType: "",
      result: true,
      activeNames: ['1', '2', '3', '4'],
      formchange: true,
      form: {
        selectedOptions3: [],
        url:"",
        name: '',
        methods: 'GET',
        addr: '',
        head: [
          {name: "", value: ""}
          ],
        parameterRaw: "",
        parameter: [
          { name: "", value: ""}
          ],
        paramstype: "",
        statusCode: "",
        resultData: "",
        resultHead: "",
        resultCookies: ""
      },
      formRules: {
        selectedOptions3: [
          { required: true, validator: validProject,trigger:'blur'}
        ],
        name: [
          { required: true, validator: validProjectName,trigger:'blur'},
          { min: 2, max: 30, message: '请输入长度在2到30个字符的接口名称', trigger: 'blur'}
        ],
        addr: [
          { required: true, message: '请输入URL地址', trigger: 'blur' },
          { required: true, validator: validHttp, trigger: 'blur' },
        ]
      },
      project_id: "",
      case_id: "",
      api_id: '',
      headers: "",
      parameters: "",
      resultShow: false,
      format: true,
      reqheaders: "",
      reqbody: "",
      reqaddr: ""

    }
  },
  methods: {
    toJSON(str) {
        try {
          if (typeof JSON.parse(str) === "object") {
            return JSON.parse(str);
          }else{
            return str;
          }
        } catch(e) {
          return str;
        }
    },
    getApi(){
      this.$axios.post('/api/detail', this.api_id)
        .then(response => {
          if (response.data.status === 'success') {
            this.form.name = response.data.data.name
            this.form.methods = response.data.data.method
            this.form.addr = response.data.data.url

            if(response.data.data.headers !== '{}'){
              var head_obj = JSON.parse(response.data.data.headers)
              let head = []
              for(var i=0;i<Object.keys(head_obj).length;i++) {
                for(var item in head_obj){
                    let hd = new Object();
                    hd.name = item
                    hd.value = head_obj[item]
                    head.push(hd)
                }
              }
              this.form.head = head
            }else{
              this.form.head = [{name: "", value: ""}]
            }


            if(response.data.data.body !== '{}' && response.data.data.body !== ''){
              if(response.data.data.paramstype === 'raw'){
                this.radio = 'raw'
                this.form.parameterRaw = response.data.data.body
              }else{
                this.radio = 'form-data'
                var bd_obj = JSON.parse(response.data.data.body)
                let bd = []
                for(var i=0;i<Object.keys(bd_obj).length;i++) {
                  for(var item in bd_obj){
                    let hd = new Object();
                    hd.name = item
                    hd.value = bd_obj[item]
                    bd.push(hd)
                  }
                }
                this.form.parameter = bd
              }

            }else{
              this.radio = 'form-data'
            }

          }
        })
        .catch(error => {
          this.radio = 'form-data'
          this.$message.error("获取API详情失败")
        })
    },
    getApiTree(){
      this.$axios.post('/case/list')
        .then(response => {
          if (response.data.status === 'success') {
            this.options = response.data.data
            // console.log(this.options)
          }else{
            this.options = [];
            this.$message.error("获取测试集失败")
          }

        })
        .catch(error => {
          this.options = [];
          this.$message.error("获取测试集失败")
        })
    },
    handleOptionsChange(val){
      debugger
      this.project_id = val[0]
      if(val.length === 2){
        this.case_id = val[1]
      }
    },
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
    getheaders(){
      let _headers = new Object();
      for (let i = 0; i < this.form.head.length; i++) {
        var a = this.form.head[i]["name"];
        if (a) {
          _headers[a] = this.form.head[i]["value"]
        }
      }
      if(_headers){
        _headers = JSON.stringify(_headers)
      }
      this.reqheaders = _headers;
      return _headers;
    },
    getparams(){
      let _parameter = new Object();
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
      this.reqbody = _parameter;
      return _parameter
    },
    commonTest(url){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.load){
            this.loadingSend = true
          }else{
            this.loadingSave = true
          }
          let _headers = this.getheaders();
          let _parameter = this.getparams();
          this.form.statusCode = '';
          this.form.resultData = '';
          this.form.resultHead = '';
          this.form.resultCookies = '';

          this.project_id = this.form.selectedOptions3[0]
          if(this.form.selectedOptions3.length === 2){
            this.case_id = this.form.selectedOptions3[1]
          }

          this.$axios.post(url, {
            'id': this.api_id,
            'project_id': this.project_id,
            'case_id': this.case_id,
            'name':this.form.name,
            'method': this.form.methods,
            'url':  this.form.addr,
            'headers': _headers,
            'body': _parameter,
            'paramstype': this.form.paramstype
          }).then(response => {
            this.loadingSend = false
            this.loadingSave = false


            if(response.data.id){
              this.$confirm(response.data.msg + '，是否跳转分组页面？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                this.$router.push({
                  path: '/api',
                  name: '测试分组',
                  query : {
                    project_id: this.project_id,
                    case_id: this.case_id
                  }
                })

              }).catch((error) => {
                console.log(error)
              });

            }else {
              this.form.statusCode = response.data.data.code
              this.form.resultHead = this.toJSON(response.data.data.headers)
              this.form.resultData = this.toJSON(response.data.data.content)
              this.form.resultCookies = this.toJSON(response.data.data.cookies)
              this.showResponse()
            }

          }).catch(error => {

            this.loadingSend = false
            this.form.statusCode = error.code
            this.form.resultHead = error.headers
            this.form.resultData = error

          })
        }
      })
    },
    fastTest: function() {
      this.load = true
      this.commonTest('/api/test')
    },
    SaveTest(){
      this.load = false
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
    addParameter() {
      let headers = {name: "", value: "", required:"True", restrict: "", description: ""};
      this.form.parameter.push(headers);
      let rows = [this.form.parameter[this.form.parameter.length-1]];
      this.toggleParameterSelection(rows)
    },
    delHead(index) {
      if (this.form.head.length !== 1) {
        this.form.head.splice(index, 1)
      }else{
        this.form.head = [{ name: "", value: ""}]
      }
    },
    delParameter(index) {
      if (this.form.parameter.length !== 1) {
        this.form.parameter.splice(index, 1)
      }else {
        this.form.parameter = [{ name: "", value: ""}]
      }
    },
    // addResponse() {
    //   let headers = {name: "", value: "", required:"True", restrict: "", description: ""};
    //   this.form.response.push(headers)
    // },
    // delResponse(index) {
    //   if (this.form.response.length !== 1) {
    //     this.form.response.splice(index, 1)
    //   }
    // },
    showRequest() {
      this.resultShow = true
      this.reqaddr = this.form.addr
      this.reqheaders = this.toJSON(this.getheaders())
      this.reqbody = this.toJSON(this.getparams())
    },
    showResponse() {
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
      // console.log('submit!');
    },
  },
  watch: {
    radio() {
      this.changeParameterType()
    }
  },
  created () {
    if(this.$route.query.project_id) {
      this.form.selectedOptions3 = [this.$route.query.project_id]
      if(this.$route.query.case_id){
        this.form.selectedOptions3 = [this.$route.query.project_id,this.$route.query.case_id ]
      }
    }
    if(this.$route.query.id){
      this.api_id = this.$route.query.id
      this.getApi()
    }
  },
  mounted() {
    this.getApiTree();
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
<style lang="scss" >
  .selectInput{
    input{
      border-right: 0px;
      border-radius: 4px 0px 0px 4px;
    }
  }
  .el-collapse-item__header{
    margin-top: 10px;
    height: 15px;
    line-height: 15px;
    font-size: 15px;
  }
  .el-cascader {
    min-width: 60%;
  }
  pre {
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

</style>
