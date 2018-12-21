<template>
  <div class="dashboard-container">

    <el-row :gutter="22">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-card class="box-card">

            <div slot="header" class="clearfix">
              <span>用例信息</span>
              <el-button style="float: right; padding: 5px;margin-left: 3px"
                         type="success" @click="changeStatus">
                切换结果
                <i class="el-icon-sort"></i>
              </el-button>
              <router-link :to="{name: '项目列表'}">
                <el-button style="float: right; padding: 5px 3px" type="primary" icon="el-icon-d-arrow-left">返回列表
                </el-button>
              </router-link>
            </div>

            <template>
              <div style="z-index: 9;float: right;position: relative;">
                <el-button  type="primary" size="medium" @click="SendTask">执行测试</el-button>
              </div>
              <el-tabs v-model="activeName1" type="card" @tab-click="handleClick">
                <el-tab-pane label="步骤" name="step">

                  <el-table
                    ref="multipleTable2"
                    :data="tasklist"
                    row-key="id"
                    height="73vh"
                    size="medium"
                    tooltip-effect="dark"
                    empty-text="暂无数据"
                    style="width: 100%"
                    @selection-change="handleTaskChange"
                  >
                    <el-table-column type="selection" width="30"></el-table-column>
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column label="接口名称" width="320">
                      <template slot-scope="scope">
                        <router-link :to="{ name: '修改API接口', query: { id: scope.row.api_id, project_id: scope.row.project_id, case_id: scope.row.case_id}}">
                          <span style="color:#409EFF">{{scope.row.api_name}}</span>
                        </router-link>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" width="65">
                      <template slot-scope="scope">
                        <el-switch
                        @click.native = "handleStatus(scope.row)"
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        inactive-color="#E6A23C"
                        active-value="1"
                        inactive-value="-1">
                        </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="185">
                      <template slot-scope="scope">
                        <el-button type="primary" plain size="mini"  icon="el-icon-circle-plus-outline" @click="drawFunction">提取</el-button>
                        <el-button type="warning" plain size="mini"  icon="el-icon-circle-plus-outline">检查</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-right: 18px;" @click="delTask(scope.row.id)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="float: right;margin-top: 5px;margin-right: 20px">
                    <el-button type="danger" plain size="mini"  :disabled="step_status" @click="deleteTask">批量删除</el-button>
                  </div>
                </el-tab-pane>
                <!--<el-tab-pane label="文档" name="api">文档</el-tab-pane>-->
              </el-tabs>
            </template>

          </el-card>

        </div>
      </el-col>

      <el-col :span="14" v-show="activeStatus">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>案例列表</span>
            </div>
            <template>
              <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="接口列表" name="interface">
                  <el-form :inline="true" class="demo-form-inline" size="mini">
                    <el-form-item label="接口名称：">
                      <el-input v-model="search.name" placeholder="请输入接口名称"></el-input>
                    </el-form-item>
                    <el-form-item label="所属项目：">
                      <el-cascader
                        placeholder="搜索：  用户项目"
                        :options="options"
                        @change="handleOptionsChange"
                        filterable
                        change-on-select></el-cascader>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>

                  </el-form>

                  <el-button type="primary" plain size="mini" style="font-size: 12px"
                             icon="el-icon-circle-plus-outline"
                              @click="addStep">添加至步骤</el-button>
                  <template>
                    <el-table
                      ref="multipleTable"
                      @row-click="rowClick"
                      :data="apilist"
                      height="68vh"
                      size="medium"
                      tooltip-effect="dark"
                      empty-text="暂无数据"
                      style="width: 100%"
                      @selection-change="handleSelectionChange">
                      <el-table-column type="selection" width="30"></el-table-column>
                      <el-table-column type="index" min-width="8%" label="序号"></el-table-column>
                      <el-table-column prop="name" label="接口名称" width="220">

                        <template slot-scope="scope">
                          <router-link :to="{ name: 'API接口', query: { id: scope.row.api_id, project_id: scope.row.project_id, case_id: scope.row.case_id}}">
                            <span style="color:#409EFF">{{scope.row.name}}</span>
                          </router-link>
                        </template>

                      </el-table-column>
                      <el-table-column  label="请求方式" width="85" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-tag type="success" v-show="scope.row.method === 'POST'">{{ scope.row.method }}</el-tag>
                          <el-tag v-show="scope.row.method === 'GET'">{{ scope.row.method }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="paramstype" label="类型" width="50" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="url" label="请求地址" width="250" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="update_author" label="最后修改者" width="90" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="modify_time" label="最后修改时间" width="150" show-overflow-tooltip></el-table-column>

                    </el-table>
                  </template>

                </el-tab-pane>
                <!--<el-tab-pane label="测试结果" name="result">文档</el-tab-pane>-->
              </el-tabs>
            </template>

          </el-card>
        </div>
      </el-col>

      <el-col :span="14" v-show="!activeStatus">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>执行结果</span>
            </div>

                 <!-- <el-collapse :data="result_list" v-for="(item,index) in result_list">
                    <el-collapse-item :name="index" :title="item.api_name" :key="item.api_id">
                      <pre>method:  {{item.req_method}}</pre>
                      <pre>url:<br/>{{item.req_url}}</pre>
                      <pre>params:<br/>{{item.req_body}}</pre>
                      <pre>request_cookies:<br/>{{item.req_cookies}}</pre>
                      <pre>request_headers:<br/>{{item.req_headers}}</pre>
                      <pre>response_code: {{item.res_code}}</pre>
                      <pre>response_cookies:<br/>{{item.res_cookies}}</pre>
                      <pre>response_headers:<br/>{{item.res_headers}}</pre>
                      <pre>response_body:<br/>{{item.res_body}}</pre>
                    </el-collapse-item>
                  </el-collapse>-->

          </el-card>
        </div>
      </el-col>

    </el-row>
    <el-dialog title="提取参数" :visible.sync="dialogFormVisible">
      <el-form :model="draw">
        <el-form-item label="活动名称" label-width="120px">
          <el-input v-model="draw.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" label-width="120px">
          <el-select v-model="draw.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import Sortable from 'sortablejs'
  export default {
    name: 'Dashboard',
    data() {
      return {
        options: [],
        step_status: true,
        activeName1: 'step',
        activeName2: 'interface',
        activeResult: ['1'],
        activeStatus: true,
        api: {
          list: []
        },
        task: {
          list:[]
        },
        search: {
          name: ''
        },
        project_id:'',
        case_id:'',
        apilist: [],
        tasklist: [],
        deal_list:[],
        result_list: [
          {
            code: 502,
            content: '返回内容',
            cookies: '返回cookies',
            headers: '返回headers'
          }
        ],
        dialogFormVisible: false,
        draw:{
          name: '',
          region: ''
        }
      };
    },
    methods: {
      drawFunction(){
        this.dialogFormVisible = true
      },
      handleStatus(row) {
        this.deal_list = [row.id]
        this.$axios.post('/task/extend/status', {
          'status': row.status,
          'list': this.deal_list
        })
          .then(response => {
              if(response.data.status !== 'success'){
                this.$message.error('更改状态失败！')
                row.status = -row.status
              }
          })
          .catch(error => {
            this.$message.error('更改状态异常！')
            row.status = -row.status
          })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      onSubmit() {
        this.getApiList()
      },
      changeStatus(){
        this.activeStatus = !this.activeStatus
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.api.list = val;
      },
      handleTaskChange(val){
        if(val.length > 0){
          let lists = val
          lists.map(cc => {
            this.task.list.push(cc.id)
          })
        }
        if (this.task.list.length > 0){
          this.step_status = false
        }else{
          this.step_status = true
        }
      },
      rowClick(row,event,column){
        if(event.target.nodeName!="INPUT"){
          this.$refs.multipleTable.toggleRowSelection(row);
        }
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
        this.api.list = []
      },
      addStep(){
        if(this.api.list.length > 0){
          console.log(this.api.list)
          this.$axios.post('/task/extend/add',
            {
              'list' : this.api.list,
              'task_id' : '81598efb-ffa9-11e8-a19c-0242ac110002'
            })
            .then(response => {
              if(response.data.status === 'success'){
                this.getTaskList()
                this.toggleSelection()
              }else{
                this.$message.error("添加步骤失败")
              }
            })
            .catch(error => {
              console.log(error)
            })
        }else{
          this.$message.info("请选择任意接口再进行添加")
        }

      },
      delTask(id){
        if(id){
          this.$confirm('是否确定删除该记录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/task/extend/del', [id])
              .then(response => {
                if(response.data.status === 'success'){
                  this.$message.success('记录已删除')
                  this.tasklist.map((value,index) => {
                    if(value.id === id){
                      this.tasklist.splice(index,1)
                    }
                  })
                }
              })
              .catch(error => {
                this.$message.error('删除异常')
              })
          }).catch((error) => {
            console.log(error)
          });
        }
      },
      SendTask(){
        this.$axios.post('/task/test', '81598efb-ffa9-11e8-a19c-0242ac110002')
          .then(response => {
            if(response.data.status === 'success'){
              this.result_list = response.data.data
              this.changeStatus()
            }
          })
          .catch(error => {
              console.log(error)
            this.$message.error('执行异常')
          })
      },
      deleteTask(){
        if(this.task.list){
          this.$confirm('是否确定批量删除记录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/task/extend/del',this.task.list)
              .then(response => {
                if(response.data.status === 'success'){
                  this.task.list = []
                  this.step_status =true
                  this.getTaskList()
                }
              })
              .catch(error => {
                this.$message.error('删除异常')
              })
          }).catch((error) => {
            console.log(error)
          });

        }
      },
      getTaskList(){
        this.$axios.post('/task/extend/info','81598efb-ffa9-11e8-a19c-0242ac110002')
          .then(response => {
            if(response.data.status === 'success'){
              this.tasklist = response.data.data;
              this.$nextTick(() => {
                this.setSort()
              })
            }
          })
          .catch(error => {

          })
      },
      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            this.$axios.post('/task/extend/deal',{
              'old_id': this.tasklist[evt.oldIndex].id,
              'old_rank': this.tasklist[evt.oldIndex].rank,
              'new_id': this.tasklist[evt.newIndex].id,
              'new_rank': this.tasklist[evt.newIndex].rank
            })
              .then(response => {
                if(response.data.status === 'success'){
                  this.task.list = []
                  this.step_status = true
                  const targetRow = this.tasklist.splice(evt.oldIndex, 1)[0]
                  this.tasklist.splice(evt.newIndex, 0, targetRow)
                }else{
                  this.$message.info("更改任务详情顺序失败")
                }
              })
              .catch(error => {
                console.log(error)
                  this.$message.error("更改任务详情顺序异常")
              })
          }
        })
      },
      getApiList(){
        this.$axios.post('/api/all_list',{
          'pageSize' : 70,
          'pageNo': 1,
          'project_id': this.project_id,
          'case_id': this.case_id,
          'name': this.search.name
        })
          .then(response => {
            if(response.data.status === 'success'){
              this.apilist = response.data.apiDTOList;
            }
          })
          .catch(error => {

          })
      },
      getApiTree(){
        this.$axios.post('/case/list')
          .then(response => {
            if (response.data.status === 'success') {
              this.options = response.data.data
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
      handleChange(val) {
        console.log(val);
      },
      handleOptionsChange(val){
        if(val.length>0){
          this.project_id = val[0]
          if(val.length === 2){
              this.case_id = val[1]
            }
        }
      },
    },
    created(){
      // this.task_id = this.$route.query.params.task_id
      this.getTaskList()
      this.getApiTree()
      this.getApiList()
    },
    mounted(){

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px 25px 20px 25px;
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 2px;
}

.grid-content {
  border-radius: 4px;
  min-height: 850px;
}
.row-bg {
  padding: 5px 0;
}

.text {
  font-size: 15px;
}
.item {
  margin-bottom: 15px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
  height: 850px;
  /deep/ .el-card__body {
    padding: 10px;
  }
}
ul li{
  list-style-type:none;
}
.checkbox-item {
  padding-right: 5px;
  /deep/ .el-checkbox {
    display: block;
    margin-left: 0;
  }
  /deep/ .el-checkbox__label{
    font-size: 15px;
    width: 100%;
  }

}
.el-scrollbar-wrap {
  height: 73vh;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  /deep/ .scrollbar-wrap {
    overflow-x: hidden;
  }
  /deep/ .el-scrollbar__thumb {
    margin-top: 20px;
  }
}
.el-button--mini, .el-button--mini.is-round {
  padding: 4px 4px;
  font-size: 14px;
  margin-left: 0px;

}


.el-table--medium  {
  /deep/ td,th{
    padding: 5px 0;
  }
}
.el-form-item {
  margin-bottom: 10px;
}
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

</style>

