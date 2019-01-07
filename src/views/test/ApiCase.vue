<template>
  <div class="dashboard-container">

    <el-row :gutter="22">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card">

            <div slot="header" class="clearfix">
              <el-button class="addGroup" type="primary"   @click="handleAddGroup">新增分组</el-button>
              <el-button type="primary" :disabled="update" @click="handleEditGroup">修改分组</el-button>
              <el-button class="addGroup" @click="toApi">快速测试</el-button>
            </div>

            <template>
              <div style="z-index: 9;float: right;position: relative;">
                <el-input size="medium"
                  placeholder="输入分组名称进行过滤"
                  v-model="filterText">
                </el-input>
              </div>
              <el-tabs v-model="activeName1" type="card" @tab-click="handleClick">
                <el-tab-pane label="项目" name="proj">
                  <el-scrollbar wrap-class="scrollbar-wrap" class="el-scrollbar-wrap">
                    <el-tree
                      class="filter-tree"
                      :data="data2"
                      :props="defaultProps"
                      @current-change="handleCheckChange"
                      default-expand-all
                      node-key="id"
                      highlight-current
                      :filter-node-method="filterNode"
                      ref="tree">
                    </el-tree>
                  </el-scrollbar>
                </el-tab-pane>
                <!--<el-tab-pane label="文档" name="api">文档</el-tab-pane>-->
              </el-tabs>
            </template>



          </el-card>

        </div>
      </el-col>

      <el-col :span="18">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-form :inline="true" @submit.native.prevent>

                <el-form-item>
                  <router-link :to="{ name: 'API接口', query: {project_id: project_id, case_id: case_id}}" style='text-decoration: none;color: aliceblue;'>
                    <el-button type="primary">新增</el-button>
                  </router-link>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.native="DownloadApi">下载接口文档</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.native="loadSwaggerApi = true">导入接口</el-button>
                  <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                  <el-dialog title="导入swagger接口" :visible.sync="loadSwaggerApi" :close-on-click-modal="false">
                    <el-input v-model.trim="swaggerUrl" placeholder="请输入swagger接口地址" style="width:90%"></el-input>
                    <el-button type="primary" @click="addSubmit" :loading="addLoading" style="padding-top: 10px">导入</el-button>
                  </el-dialog>
                </el-form-item>
                <el-form-item>
                  <el-input v-model.trim="apiName" placeholder="输入接口名称进行过滤"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <!--列表-->
            <el-table :data="filterApilist"
                      highlight-current-row
                      v-loading="listLoading"
                      height="75vh"
                      @selection-change="selsChange"
                      style="width: 100%;">
              <el-table-column type="selection" min-width="5%">
              </el-table-column>
              <el-table-column type="index" min-width="2%" label="序号"></el-table-column>
              <el-table-column label="接口名称" min-width="15%"  show-overflow-tooltip>
                <template slot-scope="scope">
                  <router-link :to="{ name: '修改API接口', query: { id: scope.row.id, project_id: project_id, case_id: case_id}}">
                    <span style="color:#409EFF">{{scope.row.name}}</span>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column  label="请求方式" min-width="8%" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.method === 'POST'">{{ scope.row.method }}</el-tag>
                  <el-tag v-else="scope.row.method === 'GET'">{{ scope.row.method }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="paramstype" label="提交方式" min-width="6%"  show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="url" label="URL地址" min-width="18%"  show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="update_author" label="最近更新人" min-width="7%"  show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="modify_time" label="更新日期" min-width="13%" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" min-width="10%">
                <template slot-scope="scope">
                  <el-button type="danger" size="small" @click="handleDel(scope.row.id)">删除</el-button>
                  <router-link :to="{ name: '修改API接口', query: { id: scope.row.id, project_id: project_id, case_id: case_id }}">
                    <el-button type="info" size="small">编辑</el-button>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog title="修改所属分组" :visible.sync="updateGroupFormVisible" :close-on-click-modal="false" style="width: 60%; left: 20%">
              <el-form :model="updateGroupForm" label-width="80px" :rules="updateGroupFormRules" ref="updateGroupForm">
                <el-form-item label="分组名称" prop="firstGroup">
                  <el-select v-model="updateGroupForm.firstGroup" placeholder="请选择">
                    <el-option v-for="(item,index) in group" :key="index+''" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateGroupFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="updateGroupSubmit" :loading="updateGroupLoading">提交</el-button>
              </div>
            </el-dialog>
            <!--工具条-->
            <el-col :span="18" :offset="6" class="toolbar" style="margin-top: 10px">
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentpage"
                  :page-sizes="sizes"
                  :page-size="pagesize"
                  :pager-count="7"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
              </div>
            </el-col>
          </el-card>
        </div>
      </el-col>

    </el-row>

    <!--新增-->
    <el-dialog title="新增分组" :visible.sync="addGroupFormVisible" :close-on-click-modal="false" style="width: 60%; left: 20%">
      <el-form :model="addGroupForm" label-width="90px"  :rules="addGroupFormRules" ref="addGroupForm">
        <el-form-item label="分组名称: " prop='groupname'>
          <el-input v-model.trim="addGroupForm.groupname" auto-complete="off" style="width: 90%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addGroupFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addGroupSubmit" :loading="addGroupLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--修改-->
    <el-dialog title="修改分组" :visible.sync="editGroupFormVisible" :close-on-click-modal="false" style="width: 60%; left: 20%">
      <el-form :model="addGroupForm" label-width="90px"  :rules="addGroupFormRules" ref="addGroupForm">
        <el-form-item label="分组名称: " prop='groupname'>
          <el-input v-model.trim="addGroupForm.groupname" auto-complete="off" style="width: 90%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editGroupFormVisible = false">取消</el-button>
        <el-button type="danger" @click.native="editGroupSubmit(1)" :loading="addGroupLoading">删除</el-button>
        <el-button type="primary" @click.native="editGroupSubmit(0)" :loading="addGroupLoading">提交</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  export default {
    data() {
      return {
        project_id:'',
        case_id: '',
        case_name: '',
        groupData: [],
        checkedproject:'',
        activeName1: 'proj',
        addGroupFormVisible: false,
        editGroupFormVisible: false,
        addGroupLoading: false,
        addFormVisible: false,//新增界面是否显示
        addGroupFormRules: {
          groupname: [
            { required: true, message: '请输入分组名称', trigger: 'blur' },
            { min: 2, max: 20, message: '请输入长度在 1 到 15 个字符的分组名称', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addGroupForm: {
          groupname: '',
        },
        editFirstGroupFormVisible: false,
        editFirstGroupLoading: false,
        editFirstFormVisible: false,//编辑界面是否显示
        editFirstGroupFormRules: {
          secondFirstGroup: [
            { required: true, message: '请输入分组名称', trigger: 'blur' },
            { min: 2, max: 20, message: '请输入长度在 2 到 20 个字符的分组名称', trigger: 'blur' }
          ]
        },
        apiName: '',
        apilist: [],
        checkedkeys : ['b87908ad-b2e3-4751-be18-ce9f2d4dc09f'],
        total: 0,
        sizes: [30, 60],
        pagesize:30,
        pageCount:1,
        page: 1,
        currentpage: 1,
        listLoading: false,
        sels: [],//列表选中列
        updateGroupFormVisible: false,
        updateGroupForm: {
          firstGroup: "",
        },
        updateGroupFormRules: {
          firstGroup : [{ type: 'number', required: true, message: '请选择分组', trigger: 'blur'}],
        },
        group: [],
        updateGroupLoading: false,
        update: true,
        loadSwaggerApi: false,
        addLoading: false,
        //新增界面数据
        swaggerUrl: "",
        filterText: '',
        data1:[],
        data2: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    computed: {
      filterApilist() {
        return this.apilist.filter(item => !this.apiName || item.name.toLowerCase().includes(this.apiName.toLowerCase()))
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      toApi(){
        this.$router.push({
          path: '/api',
          name: 'API接口',
          query : {
            project_id: this.$route.query.project_id,
            case_id: this.case_id
          }
        })
      },
      getApiList(pageSize, pageNo){
        //获取project分组列表
        this.$axios.post('/api/list',{
          'project_id': this.$route.query.project_id,
          'case_id' : this.case_id,
          'pageSize' : pageSize,
          'pageNo' : pageNo
        })
          .then(response => {
            if(response.data.status === "SUCCESS"){
              this.apilist = response.data.apiDTOList
              this.total = response.data.total
              this.pageSize = response.data.pageSize
              this.pageNo = response.data.pageNo
              this.pageCount = response.data.pageCount
            }
          })
          .catch(error => {
            this.$message.error("获取测试集异常")
          })


      },
      getProjectList(){
        //获取project分组列表
        this.$axios.post('/case/list', this.project_id)
          .then(response => {
              if (response.data.status === 'SUCCESS') {
                this.data2 = response.data.data
              }else{
                this.data2 = [];
                this.$message.error("获取测试集失败")
              }
            }
          )
          .catch(error => {
            this.data2 = [];
            this.$message.error("获取测试集失败")
          })

      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(this.$refs.tree.getCurrentKey())
        if(!data.children){
          this.update = false
        }
        this.case_id = data.id
        this.addGroupForm.groupname = data.label
        if(data.children){
          this.case_id = ''
        }
        this.$axios.post('/api/list',{
          'project_id': this.project_id,
          'case_id' : this.case_id
        })
          .then(response => {
            if(response.data.status === "SUCCESS"){
              this.apilist = response.data.apiDTOList
            }
          })
          .catch(error => {
            this.$message.error("获取测试集异常")
          })

      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      addSubmit(){
        let self = this;
        this.addLoading = true;
        if (this.swaggerUrl){

        } else {
          this.addLoading = false
        }
      },
      // 添加分组弹窗显示
      handleAddGroup() {
        this.addGroupForm.groupname = ''
        this.addGroupFormVisible = true;
      },
      handleEditGroup(){
        this.editGroupFormVisible = true;
      },
      addGroupSubmit(){
        this.$refs.addGroupForm.validate(valid => {
          if(valid){
            this.$axios.post('/case/add',{
              'project_id': this.project_id,
              'id': this.case_id,
              'name': this.addGroupForm.groupname
            })
              .then(response => {
                if(response.data.status === 'SUCCESS'){
                  this.addGroupFormVisible = false;
                  this.$message.success('分组已添加')
                  this.getProjectList();
                }else {
                  this.$message.error("添加分组失败")
                }

              }).catch(error => {
              this.$message.error("添加分组异常")
            })
          }
        })

      },
      editGroupSubmit(author){
        this.$refs.addGroupForm.validate(valid => {
          if(valid){
            this.$axios.post('/case/edit',{
              'project_id': this.project_id,
              'id': this.case_id,
              'author': author,
              'name': this.addGroupForm.groupname
            })
              .then(response => {
                if(response.data.status === 'SUCCESS'){
                  this.editGroupFormVisible = false;
                  this.$message.success(response.data.msg)
                  this.getProjectList();
                }else {
                  this.$message.error("操作分组失败")
                }

              }).catch(error => {
              this.$message.error("操作分组异常")
            })
          }
        })
      },
      selsChange: function (sels) {
        if (sels.length>0) {
          this.sels = sels;
        }
      },
      handleSizeChange(val) {
        this.pagesize = val;
        this.getApiList(this.pagesize, 1);
      },
      handleCurrentChange(val) {
        this.currentpage = val;
        this.getApiList(this.pagesize,this.currentpage)

      },
      handleDel: function (id) {
        this.$confirm('确认删除该记录吗？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/del',  id
          ).then(response => {
            if(response.data.status === 'SUCCESS'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getApiList(30,1)

            }else{
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }

          }).catch(error => {
            this.$message.error({
              message:'删除异常',
              center:false
            })
          })

        }).catch(error => {
          console.log(error);
        })

      },
      //批量删除
      batchRemove: function () {
        let ids = this.sels.map(item => item.id);
        console.log(ids)
        let self = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          self.listLoading = true;
          this.$axios.post('/api/del/ids',ids)
            .then(response => {
              self.listLoading = false;
              if(response.data.status === 'SUCCESS'){
                this.getApiList(30,1)
                this.$message.success("记录已删除")
              }else {
                this.$message.error(response.data.msg)
              }
            })
            .catch(error => {
              self.listLoading = false;
              this.$message.error('删除异常')
            })
        })
      }
    },
    created(){
      if(this.$route.query.project_id === undefined || this.$route.query.project_id ==='' || !this.$route.query.project_id){
        this.$router.push({
          path: '/404'
        })
      }
      this.project_id = this.$route.query.project_id
      if(this.$route.query.case_id){
        this.case_id = this.$route.query.case_id
        this.checkedkeys = [this.$route.query.case_id]
      }
    },
    mounted() {
      this.getProjectList();
      this.getApiList(30,1)
      this.$nextTick((e) => {
        setTimeout(() => {
          this.$refs.tree.setCurrentKey(this.case_id)
        },30)
      })
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
    height: 795px;
  }
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
.logdata {
  height: 80vh;
  overflow: auto;
  ul {
    margin: 0;
    li {
      padding: 0;
      list-style: none;
    }
  }
}

</style>

