<template>
  <div class="dashboard-container">

    <el-row :gutter="24">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card class="box-card">

            <div slot="header" class="clearfix">
              <el-form :inline="true"  @submit.native.prevent>
                <el-form-item>
                  <el-input  placeholder="请输入任务ID" v-model="search.id"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input  placeholder="请输入任务名称" v-model="search.name"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"  @click="searchTask">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="open_task">新增任务</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="success" @click="start_all">启动调度器</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" @click="stop_all">暂停调度器</el-button>
                </el-form-item>
              </el-form>
            </div>

            <template>
              <el-table
                ref="multipleTable"
                :data="tasklist"
                v-loading="listLoading"
                height="72vh"
                size="medium"
                tooltip-effect="dark"
                empty-text="暂无数据"
                style="width: 100%"
              >
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column
                  label="任务ID"
                  width="290"
                >
                  <template slot-scope="scope">
                    <router-link :to="{ name: '任务详情', query: { id: scope.row.id}}">
                      <span style="color:#409EFF">{{scope.row.id}}</span>
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="任务名称"
                  width="210"
                >
                </el-table-column>
                <el-table-column
                  prop="start_time"
                  label="开始时间"
                  width="170"
                  show-overflow-tooltip
                >
                </el-table-column>
                  <el-table-column
                    prop="end_time"
                    label="结束时间"
                    width="170"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                <el-table-column
                  prop="cron_expression"
                  label="表达式"
                  width="110"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column label="启用" width="62">
                  <template slot-scope="scope">
                    <el-switch
                      @click.native="handleStatus(scope.row)"
                      v-model="scope.row.status"
                      active-color="#13ce66"
                      inactive-color="#7f8186"
                      active-value="1"
                      inactive-value="-1"
                    >
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column  label="执行状态" width="100">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.trigger_STATE === 'PAUSED'">已暂停</el-tag>
                    <el-tag type="info" v-if="!scope.row.trigger_STATE && scope.row.status==='-1'">待启用</el-tag>
                    <el-tag type="info" v-if="!scope.row.trigger_STATE && scope.row.status==='1'">待处理</el-tag>
                    <el-tag type="success" v-if="scope.row.trigger_STATE === 'ACQUIRED'">运行中</el-tag>
                    <el-tag type="success" v-if="scope.row.trigger_STATE === 'WAITING'">运行中</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="update_author" label="修改者" width="90" ></el-table-column>
                <el-table-column prop="modify_time" label="修改时间" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="280">
                  <template slot-scope="scope">
                    <el-button type="warning" plain size="mini" icon="el-icon-refresh" @click="resume_one(scope.row)">启动</el-button>
                    <el-button type="primary" plain size="mini" icon="el-icon-warning" @click="stop_one(scope.row)">暂停</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDel(scope.row.id)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <div class="block" style="padding-left: 30%">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentpage"
                :page-sizes="sizes"
                :page-size="pageSize"
                :pager-count="7"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>

          </el-card>

        </div>
      </el-col>

    </el-row>
    <el-dialog title="添加任务" :visible.sync="dialogTaskVisible">
      <el-form :model="ConfigForm" ref="ConfigForm" :rules="rules"  label-width="100px">
        <el-form-item label="任务名称:" prop="name">
          <el-input v-model="ConfigForm.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="开始时间:" prop="start_time">
          <el-date-picker
            v-model="ConfigForm.start_time"
            type="datetime"
            placeholder="选择日期时间"
            align="left"
            @change="changeStart"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间:" prop="end_time">
          <el-date-picker
            v-model="ConfigForm.end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            align="left"
            style="width: 100%"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="定时策略:" prop="cron">
          <el-popover v-model="cronPopover">
            <cron @change="changeCron" @close="cronPopover=false"></cron>
            <el-input slot="reference" @click="cronPopover=true" v-model="ConfigForm.cron" placeholder="请输入定时策略"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="状态:">
          <el-switch v-model="ConfigForm.status"
                     active-color="#13ce66"
                     inactive-color="#7f8186"
                     active-value="1"
                     inactive-value="-1"></el-switch>
        </el-form-item>
        <el-form-item >
          <el-button @click="dialogTaskVisible = false">取 消</el-button>
          <el-button type="primary" @click="add_Task">保存</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  import {cron} from 'vue-cron'
  export default {
    components: { cron },
    data() {
      var validateEndTime = (rule, value, callback) => {
        if (this.ConfigForm.start_time > value) {
          callback(new Error('结束时间必须大于开始时间'));
        } else {
          callback();
        }
      }
      return {
        cronPopover:false,
        rules: {
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          start_time: [
            {  required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          end_time: [
            {  required: true, message: '请选择结束时间', trigger: 'blur' },
            { required: true, validator : validateEndTime, trigger: 'blur'}
          ],
          cron: [
            { required: true, message: '请输入定时策略', trigger: 'change' },
          ],
        },
        ConfigForm: {
          name: '',
          start_time: '',
          end_time: '',
          status: '1',
          cron: ''
        },
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        dialogTaskVisible: false,
        listLoading: false,
        tasklist: [],
        task_id: '',
        search:{
          id: '',
          name:''
        },
        total: 10,
        sizes: [30, 50, 80],
        pageSize: 30,
        pageCount: 1,
        page: 1,
        currentpage: 1,
      }
    },
    methods: {
      changeStart(val){
        console.log(this.ConfigForm.start_time)
      },
      searchTask(){
        this.getTaskList(30,1);
      },
      add_Task(){
        this.$refs.ConfigForm.validate((valid) => {
          if(valid){
            this.$axios.post('/task/deal',{
              'name': this.ConfigForm.name,
              'start_time': this.ConfigForm.start_time,
              'end_time': this.ConfigForm.end_time,
              'cron_expression': this.ConfigForm.cron,
              'status': this.ConfigForm.status
            })
              .then(res => {
                this.dialogTaskVisible = false
                if(res.data.status ==='SUCCESS'){
                  this.$message({
                    type: 'success',
                    duration:1000,
                    message:'任务添加'
                  })
                  this.getTaskList(30,1)
                }else {
                  this.$message({
                    type: 'error',
                    duration:1000,
                    message:res.data.msg
                  })
                }
              })
              .catch(error => {
                this.dialogTaskVisible
                console.log(error)
                this.$message({
                  type: 'error',
                  duration:1000,
                  message:'添加任务异常'
                })
              })
          }
        })
      },
      changeCron(val){
        this.ConfigForm.cron=val
      },
      open_task(){
        this.dialogTaskVisible = true
      },
      getTaskList(pageSize,currentpage){
        this.listLoading = true
        this.$axios.post('/task/list',{
          'pageSize': pageSize,
          'pageNo': currentpage,
          'id': this.search.id,
          'name': this.search.name
        })
          .then(res => {
            if(res.data.status ==='SUCCESS'){
              this.tasklist = res.data.data
              this.total = res.data.total;
              this.pageSize = res.data.pageSize;
              this.pageNo = res.data.pageNo;
              this.pageCount = res.data.pageCount;
            }else{
              this.$message.error(res.data.msg)
            }
            this.listLoading = false
          })
          .catch(error => {
            console.log(error)
            this.listLoading = false
            this.$message.error('获取任务列表失败')
          })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getTaskList(this.pageSize, 1);
      },
      handleCurrentChange(val) {
        this.currentpage = val;
        this.getTaskList(this.pageSize, this.currentpage);
      },
      handleDel(id) {
        this.$axios.post("/task/del", id)
          .then(response => {
            if (response.data.status !== "SUCCESS") {
              this.$message.error('任务删除失败');
            }else{
              this.$message.success('任务已删除');
              this.getTaskList(30,1)
            }
          })
          .catch(error => {
            console.log(error)
            this.$message.error("任务删除异常！");

          });
      },
      handleStatus(row) {
        this.task_id = row.id;
        this.$axios.post("/task/status", {
            status: row.status,
            id: this.task_id
          })
          .then(response => {
            if (response.data.status === "SUCCESS") {
              if(row.status === '1'){
                row.trigger_STATE = 'ACQUIRED'
              }else {
                row.trigger_STATE = ''
              }
            }else{
              row.status = -row.status;
              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error)
            row.status = -row.status;
            this.$message.error("更改任务状态异常！");

          });
      },
      stop_one(row){
        if(!row.id){
          this.$message.info('任务ID不能为空')
        }
        this.$axios.post('/job/stop',row.id)
          .then(res => {
            if(res.data.status === 'SUCCESS') {
              row.trigger_STATE = 'PAUSED'
              this.$message({
                message: '任务已暂停',
                duration: 1000,
                type: 'success'
              })
            }else{
              this.$message.info(res.data.msg)
            }
          })
          .catch(error => {
            console.log(error)
            this.$message.error('任务暂停失败')
          })
      },
      resume_one(row){
        this.$axios.post('/job/resume',row.id)
          .then(res => {
            if(res.data.status === 'SUCCESS') {
              row.trigger_STATE = 'ACQUIRED'
              this.$message({
                message: '任务已启动',
                duration: 1000,
                type: 'success'
              })
            }else{
              this.$message.info(res.data.msg)
            }
          })
          .catch(error => {
            console.log(error)
            this.$message.error('启动任务失败')
          })
      },
      stop_all(){
        this.$axios.get('/job/stop_all_jobs')
          .then(res => {
            if(res.data.status === 'SUCCESS') {
              this.$message({
                message: '调度器已暂停',
                duration: 1000,
                type: 'success'
              })
            }else{
              this.$message.info(res.data.msg)
            }
          })
          .catch(error => {
            console.log(error)
            this.$message.error('调度器暂停失败')
          })
      },
      start_all(){
        this.$axios.get('/job/start_all_jobs')
          .then(res => {
            if(res.data.status === 'SUCCESS'){
              this.$message({
                message: '调度器已启动',
                duration: 1000,
                type: 'success'
              })
            }else{
              this.$message.info(res.data.msg)
            }

          })
          .catch(error => {
            console.log(error)
            this.$message.error('启动调度器失败')
          })
      }
    },
    computed:{

    },
    mounted() {
      this.getTaskList(30,1)
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 15px 20px 15px 20px;
    }
  }
  .box-card {
    width: 100%;
    height: 90vh;
    /deep/ .el-card__body {
      padding: 10px;
      height: 80vh;
    }
    /deep/ .el-form-item {
    margin-bottom: 0px;
    }
  }
  .el-table {
    /deep/ th{
      padding: 0px 0;
    }
  }
</style>



