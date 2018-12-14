<template>
  <div class="dashboard-container">

    <el-row :gutter="22">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-card class="box-card">

            <div slot="header" class="clearfix">
              <span>用例信息</span>
              <el-button style="float: right; padding: 5px;margin-left: 3px" type="success">
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
                <el-button  type="primary" size="medium">执行测试</el-button>
              </div>
              <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="步骤" name="third">

                    <el-checkbox-group class="checkbox-group" v-model="api.list">
                      <el-scrollbar wrap-class="scrollbar-wrap" class="el-scrollbar-wrap">
                      <div class="checkbox-item">
                        <el-checkbox  v-for="item in apilist" :label="item.id"   :key="item.id">
                            {{item.name}}
                            <div style="font-size: 5px; display: inline-block; float: right;">
                              <el-button type="primary" plain size="mini"  icon="el-icon-circle-plus-outline">入参</el-button>
                              <el-button type="primary" plain size="mini"  icon="el-icon-circle-plus-outline">检查</el-button>
                              <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-right: 18px;"></el-button>
                            </div>
                        </el-checkbox>
                      </div>
                      </el-scrollbar>
                    </el-checkbox-group>



                </el-tab-pane>
                <el-tab-pane label="文档" name="fourth">文档</el-tab-pane>
              </el-tabs>
            </template>


          </el-card>

        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>案例列表</span>
            </div>

            <template>
              <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">

                <el-tab-pane label="接口列表" name="third">
                  <el-form :inline="true" :model="formInline" class="demo-form-inline" size="medium">
                    <el-form-item label="接口名称：">
                      <el-input v-model="formInline.user" placeholder="请输入接口名称"></el-input>
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

                  <el-button type="primary" plain size="small" style="font-size: 10px"
                             icon="el-icon-circle-plus-outline">添加至步骤</el-button>
                  <template>
                    <el-table
                      ref="multipleTable"
                      :data="apilist"
                      height="600"
                      size="medium"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="handleSelectionChange">
                      <el-table-column
                        type="selection"
                        width="30">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="接口名称"
                          width="250">
                      </el-table-column>
                      <el-table-column
                        prop="url"
                        label="请求地址"
                        width="550"
                        show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column  label="请求方式" width="85" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-tag type="success" v-show="scope.row.method === 'POST'">{{ scope.row.method }}</el-tag>
                          <el-tag v-show="scope.row.method === 'GET'">{{ scope.row.method }}</el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>

                </el-tab-pane>

                <el-tab-pane label="定时任务补偿" name="fourth">文档</el-tab-pane>
              </el-tabs>
            </template>

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
        activeName2: 'third',
        api: {
          list: []
        },
        task: {
          list:[]
        },
        multipleSelection: [],
        formInline: {
          user: '',
          region: ''
        },
        apilist: []
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      onSubmit() {
        console.log('submit!');
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
        this.multipleSelection = val;
      },
      getApiList(){
        this.$axios.post('/api/all_list',{
          'pageSize' : 40,
          'pageNo' : 1
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
        // this.project_id = val[0]
        // if(val.length === 2){
        //   this.case_id = val[1]
        // }
        //
        // console.log(this.project_id)
        // console.log(this.case_id)
        // console.log(val.length)
        // console.log(val[0])

      },


    },
    created(){
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
    font-size: 13px;
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
  padding: 5px 5px;
  font-size: 14px;
  margin-bottom: 3px;

}
.el-card__body {
  padding: 10px;
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

