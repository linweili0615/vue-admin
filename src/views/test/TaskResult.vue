<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span style="font-size: x-large;">自动化测试报告</span>
          <p style="margin-top: 20px;">
            <span class="report">开始时间: {{start_time}}</span>
            <span class="report">执行时长: {{consuming_time}}秒</span>
            <span class="report">结束时间: {{end_time}}</span>
            <span class="report">任务ID: {{task_id}}</span>
            <span class="report">执行者: {{executor}}</span>
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row class="bg-purple-light">
      <el-col :span="6" ><div class="grid-content"><span class="failue">{{allresult}}</span></div></el-col>
      <el-col :span="3"><div class="grid-content "><span class="normal">总数：</span><span class="digical">{{total}}</span></div></el-col>
      <el-col :span="3"><div class="grid-content"><span class="normal">通过：</span><span class="digical-success">{{success}}</span></div></el-col>
      <el-col :span="3"><div class="grid-content"><span class="normal">失败：</span><span class="digical-failue">{{fail}}</span></div></el-col>
      <el-col :span="5"><div class="grid-content"><span class="normal">通过率：</span><span class="digical">{{percent}} %</span></div></el-col>
    </el-row>

    <div style="margin-top: 20px">
      <template>
        <el-table
          :data="tableData5"
          height="68vh"
          empty-text="暂无结果信息"
          style="width: 100%">
          <el-table-column type="index" width="45"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="请求参数: ">
                  url: <pre>{{props.row.req_url}}</pre>
                  headers: <pre>{{props.row.req_headers}}</pre>
                  cookies: <pre>{{props.row.req_cookies}}</pre>
                  params: <pre>{{props.row.req_body}}</pre>
                </el-form-item>
                <el-form-item label="返回参数: ">
                  code: {{props.row.res_code}}<br/><br/>
                  cookies: <pre>{{props.row.res_cookies}}</pre>
                  data: <pre>{{props.row.res_body}}</pre>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="API" prop="api_id" width="300"></el-table-column>
          <el-table-column label="接口名称" prop="api_name" width="350"></el-table-column>
          <el-table-column label="请求地址" prop="req_url" width="330" show-overflow-tooltip></el-table-column>
          <el-table-column  label="请求方式" width="85" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.req_method == 'POST'">{{ scope.row.req_method }}</el-tag>
              <el-tag v-else>{{ scope.row.req_method }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="测试结果" prop="result" width="80"></el-table-column>
          <el-table-column label="开始时间" prop="start_time"></el-table-column>
          <el-table-column label="结束时间" prop="end_time"></el-table-column>
        </el-table>
      </template>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        allresult: '成功',
        total: 0,
        success: 0,
        fail: 0,
        percent: 0,
        task_id: '',
        start_time: '',
        end_time: '',
        consuming_time: '',
        executor: '',
        tableData5: [{
          api_id: '1da3d5ee-4cca-4f14-8fe3-8e27d8c46ef5',
          api_name: '好滋好味鸡蛋仔',
          req_method: 'GET',
          req_headers: '',
          req_url: 'https://passport.tuandai.com/2login',
          start_time: '2019-01-06 14:43:46:234',
          end_time: '2019-01-06 14:43:50:448',
          req_cookies: '',
          req_body: '',
          res_code: '',
          res_headers:'',
          res_body:'',
          res_cookies: '',
          result: '通过'
        }
        ]
      }
    },
    methods: {
      getTaskResult(){
        this.$axios.post('/task/getResult',this.task_id)
          .then(response => {
            const res = response.data
            if(res.status === 'SUCCESS'){
              const result = JSON.parse(res.data)
              console.log(result)
              this.total = result.total
              this.success = result.success
              this.fail = result.fail
              if(this.fail > 0){
                this.allresult = '失败'
              }
              this.percent = result.percent
              this.start_time = result.start_time
              this.end_time = result.end_time
              this.consuming_time = result.consuming_time
              this.executor = result.executor
              this.tableData5 = result.resultList

              console.log(this.tableData5)
            }else {
              this.$message.error(result.msg)
            }
          })
          .catch(error => {
              console.log(error)
          })
      }
    },
    created(){
      this.task_id = this.$route.query.task_id
      if(!this.task_id){
        next({ path: '/404' })
      }
    },
    mounted(){
      this.getTaskResult()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-dark {
  background: #252222;
}
.bg-purple-light {
  background: #e4e4e4;
  line-height: 50px;
}
.failue{
  color: red;
  font-size: 40px;
}
.normal{
  color: black;
}
.grid-content {
  margin: 0px;
  padding: 20px 10px 2px 20px;
  color: white;
  min-height: 36px;
  .report{
    font-size: 15px;
    margin-right: 30px;
    color: #d3dce6;
  }
  .digical{
    font-size: 30px;
    color: black;
    &-failue{
      font-size: 30px;
      color: red;
    }
    &-success{
      font-size: 30px;
      color: #67c23a;
    }
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
pre {
  width: 60vh;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;

}
.el-form-item {
  /deep/ .el-form-item__content {
   line-height: 100%;
  }
}

</style>
