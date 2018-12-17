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
                    <el-checkbox-group class="checkbox-group" v-model="task.list" @change="handleCheckboxChange">
                      <el-scrollbar wrap-class="scrollbar-wrap" class="el-scrollbar-wrap">
                      <div class="checkbox-item">
                        <el-checkbox  v-for="item in tasklist" :label="item.id"   :key="item.id">
                          <router-link :to="{ name: '修改API接口', query: { id: item.api_id, project_id: item.project_id, case_id: item.case_id}}">
                            <span style="color:#409eff;text-decoration:underline">{{item.api_name}}</span>
                          </router-link>
                          <i class="el-icon-success" v-show="item.status==='1'" style="color: #67c23a"></i>
                          <i class="el-icon-warning" v-show="item.status!=='1'" style="color: #909399;"></i>
                            <div style="font-size: 5px; display: inline-block; float: right;">
                              <el-button type="info" v-show="item.status==='1'" size="mini">禁用</el-button>
                              <el-button type="info" v-show="item.status!=='1'" size="mini">启用</el-button>
                              <el-button type="primary" plain size="mini"  icon="el-icon-circle-plus-outline">提取</el-button>
                              <el-button type="warning" plain size="mini"  icon="el-icon-circle-plus-outline">检查</el-button>
                              <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-right: 18px;" @click="delTask(item.id)"></el-button>
                            </div>
                        </el-checkbox>

                      </div>
                      </el-scrollbar>
                     <div style="float: right;margin-top: 5px">
                       <el-button type="danger" plain size="mini"  :disabled="step_status">批量删除</el-button>
                       <el-button type="danger" plain size="mini" :disabled="step_status" style="margin-left:5px">批量更改状态</el-button>
                     </div>
                    </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="文档" name="api">文档</el-tab-pane>
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
                      height="650"
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
                      <el-table-column prop="paramstype" label="参数类型" width="85" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="url" label="请求地址" width="300" show-overflow-tooltip></el-table-column>
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

                  <el-collapse v-model="activeResult" @change="handleChange">
                    <el-collapse-item name="1">
                      <template slot="title">
                        测试接口一<i class="el-icon-success" style="color: greenyellow"></i>
                      </template>
                      <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                      <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                    </el-collapse-item>
                    <el-collapse-item title="测试接口二" name="2">
                      <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                      <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                    </el-collapse-item>
                    <el-collapse-item title="测试接口三" name="3">
                      <div>简化流程：设计简洁直观的操作流程；</div>
                      <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                      <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
                    </el-collapse-item>
                    <el-collapse-item title="测试接口四" name="4">
                      <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                      <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
                    </el-collapse-item>
                  </el-collapse>

          </el-card>
        </div>
      </el-col>

    </el-row>

  </div>
</template>

<script>
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
        // task_id: '',
        apilist: [],
        tasklist: []
      };
    },
    methods: {
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
                this.changeStatus()
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
            this.$axios.post('/task/extend/del',id)
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
              console.log(response.data.data)
            }
          })
          .catch(error => {
              console.log(error)
          })
      },
      getTaskList(){
        this.$axios.post('/task/extend/info','81598efb-ffa9-11e8-a19c-0242ac110002')
          .then(response => {
            if(response.data.status === 'success'){
              this.tasklist = response.data.data;
            }
          })
          .catch(error => {

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
      handleCheckboxChange(){
        if (this.task.list.length > 0){
          this.step_status = false
        }else{
          this.step_status = true
        }
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
    font-size: 14px;
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
  margin-bottom: 3px;
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


</style>

