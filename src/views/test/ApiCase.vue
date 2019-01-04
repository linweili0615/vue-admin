<template>
    <section>

      <el-row class="row-title">

        <el-col :span="5">
          <el-button class="addGroup" type="primary" round @click="handleAddGroup">新增分组</el-button>
          <el-button type="primary" round :disabled="update" @click="handleEditGroup">修改分组</el-button>
          <el-button class="addGroup" @click="toApi">快速测试</el-button>

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

          <div class="grid-content bg-purple">
            <el-input
              placeholder="输入分组名称进行过滤"
              v-model="filterText">
            </el-input>
            <br/>
            <br/>

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

          </div>
        </el-col>

        <el-col :span="18" :offset="1">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" style="height: 33px">
              <el-form :inline="true" :model="filters" @submit.native.prevent>

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
                  <el-input v-model.trim="filters.name" placeholder="输入接口名称进行过滤"></el-input>
                </el-form-item>
              </el-form>
              <!--列表-->
              <el-table :data="apilist.filter(data => !filters.name || data.name.toLowerCase().includes(filters.name.toLowerCase()))"
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
                    <el-tag type="success" v-show="scope.row.method === 'POST'">{{ scope.row.method }}</el-tag>
                    <el-tag v-show="scope.row.method === 'GET'">{{ scope.row.method }}</el-tag>
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
            </el-col>
          </div>
        </el-col>

      </el-row>
    </section>
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
              filters: {
                name: ''
              },
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
        watch: {
          filterText(val) {
            this.$refs.tree.filter(val);
          }
        },
        methods: {
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
            let self = this;
            this.$confirm('确认删除选中记录吗？', '提示', {
              type: 'warning'
            }).then(() => {
              self.listLoading = true;
            }).catch(() => {
            });
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

<style lang="scss">
.api-title {
    padding: 15px;
    margin: 0px;
    text-align: center;
    border-radius:5px;
    font-size: 15px;
    color: aliceblue;
    background-color: rgb(32, 160, 255);
    font-family: PingFang SC;
}
.group .editGroup {
    float:right;
}
.row-title {
    margin: 35px;
}
.addGroup {
    margin-top: 0px;
    margin-bottom: 10px;
    border-radius: 25px;
}

.el-scrollbar-wrap {
  height: 67vh;
  /deep/ .el-scrollbar__thumb {
    /*margin-left: 20px;*/
    margin-top: 20px;
  }
}
.scrollbar-wrap {
  overflow-x: hidden !important;
}
.el-tag {
  font-size: 15px;
  border-radius: 0px;
}
.el-table td, .el-table th{
  padding: 10px 0;
}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #66b1ff;
}


</style>
