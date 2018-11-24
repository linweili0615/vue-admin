<template>
  <div class="dashboard-container">

    <template>
      <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
                <el-form-item>
                    <el-input v-model="filters.id" placeholder="请输入项目ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="filters.project_name" placeholder="请输入项目名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getProjectList(10,1)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="project.slice(0, pagesize)"
                  highlight-current-row v-loading="listLoading"
                  border
                  height="700"
                  @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="index" min-width="2%" label="序号"></el-table-column>
            <el-table-column min-width="23%" label="项目ID">
              <template slot-scope="scope">
                <a @click="handleclick(scope.row)">{{scope.row.id}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="project_name" label="项目名称" min-width="16%" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="author" label="创建人" min-width="8%" sortable></el-table-column>
            <el-table-column prop="update_author" label="最后修改人" min-width="8%" sortable></el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="10%" sortable></el-table-column>
            <el-table-column prop="modify_time" label="最后修改时间" min-width="10%" sortable></el-table-column>
            <el-table-column label="状态" min-width="6%" sortable>
              <template slot-scope="scope">{{scope.row.status===1?'启用':'禁用'}}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="19%">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button type="info" size="small" @click="handleChangeStatus(scope.$index, scope.row)">{{scope.row.status===1?'禁用':'启用'}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="12" :offset="6" class="toolbar" style="margin-top: 10px">
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

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" style="width: 75%; left: 12.5%">
            <el-form :model="editForm" label-width="80px"  :rules="editFormRules" ref="editForm">
                <el-form-item label="项目名称" prop="project_name">
                    <el-input v-model="editForm.project_name" auto-complete="off"></el-input>
                </el-form-item>
                  <el-col :span="12">
                    <el-form-item label="状态" prop='status'>
                      <el-select v-model="editForm.status" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false"
                   :before-close="handleClose"
                   style="width: 80%; left: 12.5%">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="项目名称" prop="project_name">
                    <el-input v-model.trim="addForm.project_name" auto-complete="off" placeholder="请输入项目名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
      </section>
</template>

  </div>
</template>
<script>

    export default {
        data() {
          const validProjectName =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请输入项目名称'))
            }else if(value.length < 2 ){
              callback(new Error('请输入长度在2到30个字符的项目名称'))
            }else if(value.length > 30){
              callback(new Error('请输入长度在2到30个字符的项目名称'))
            }else{
              callback()
            }
          }
            return {
                filters: {
                    id:'',
                  project_name: ''
                },
                project: [],
                total: 0,
                sizes: [10, 20, 30, 40],
                pagesize:10,
                pageCount:1,
                page: 1,
                currentpage: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                options: [{ label: "启用", value: 1}, { label: "禁用", value: -1}],
                editFormRules: {
                  project_name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { min: 2, max: 15, message: '请输入长度在2到30个字符的项目名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: '',
                    project_name: '',
                    status: '',
                    author: '',
                    update_author: '',
                    create_time: '',
                    modify_time: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    project_name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { min: 2, max: 30, message: '请输入长度在2到30个字符的项目名称', trigger: 'blur' },
                        { required: true, trigger: 'blur', validator: validProjectName }
                    ]
                },
                //新增界面数据
                addForm: {
                  project_name: ''
                }

            }
        },
        methods: {
            // 获取项目列表
            getProjectList(pageSize,pageNo) {
              if(pageNo > this.pageCount){
                pageNo = this.pageCount;
              }
                this.listLoading = true;
                this.$axios.post('/project/list',{
                    'id': this.filters.id,
                    'project_name': this.filters.project_name,
                    'pageSize': pageSize,
                    'pageNo': pageNo
                }).then(response =>{

                    if(response.data.status === 'success'){
                      this.total = response.data.total;
                      this.pagesize = response.data.pageSize;
                      this.currentpage = response.data.pageNo;
                      this.pageCount = response.data.pageCount;
                      this.project = response.data.projectDTOList;
                      this.listLoading = false;
                    }else{
                      this.listLoading = false;
                      this.$message.error({
                        message:'获取项目列表失败',
                        center:false
                      })
                    }

                  }).catch(error => {
                  this.listLoading = false;
                  this.$message.error({
                    message:'获取项目列表异常',
                    center:false
                  })
                })

            },
            //删除
            handleDel: function (index, row) {
              // console.log(index, row)
              this.$confirm('确认删除该记录吗？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$axios.post('/project/del', row.id).then(response => {
                  // console.log(response.data);
                  if(response.data.status === 'success'){
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.filters.id = ''
                    this.filters.project_name = ''
                    this.getProjectList(10,1);
                  }else{
                    this.$message({
                      type: 'success',
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
            //点击行响应
            handleclick: function(row){
              this.$router.push({
                path: '/api',
                name: '接口列表',
                params:{
                  project_id : row.id
                }
              })
            },
            handleClose(){
              this.addForm.project_name = ''
            },
            // 改变项目状态
            handleChangeStatus: function(index, row) {
              // console.log(row)
              this.$axios.post('/project/handle',{
                'id':row.id,
                'status': row.status
              }).then(response => {
                if(response.data.status === 'success'){
                  row.status = -row.status;
                  this.$message.success({
                    message:'操作成功',
                    center:true
                  })
                }else {
                  this.listLoading = false;
                  this.$message.error({
                    message:'操作失败',
                    center:true
                  })
                }

              }).catch(error => {
                console.log(error)
                this.listLoading = false;
                this.$message.error({
                  message:'操作异常',
                  center:false
                })
              })
            },
            handleSizeChange(val) {
              this.pagesize = val;
              this.getProjectList(this.pagesize, 1);
            },
            handleCurrentChange(val) {
              this.currentpage = val;
              this.getProjectList(this.pagesize,this.currentpage)

            },
            //显示编辑界面
            handleEdit: function (index, row) {
              // console.log(index,row)
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
            },
            //编辑
            editSubmit: function () {
              this.$refs.editForm.validate(valid => {
                if(valid){
                  this.$axios.post('/project/update',{
                    'id': this.editForm.id,
                    'project_name': this.editForm.project_name,
                    'status': this.editForm.status
                  }).then(response => {
                      if(response.data.status === 'success'){
                        this.$message.success({
                          message:'更新项目成功',
                          center:true
                        })
                        this.editFormVisible = false;
                        this.filters.id = ''
                        this.filters.project_name = ''
                        this.getProjectList(10,1);
                      }else{
                        this.$message.error({
                          message:'更新项目异常',
                          center:false
                        })
                      }
                  }).catch(error => {
                    this.$message.error({
                      message:'更新项目异常',
                      center:false
                    })
                  })
                }
              })

            },
            //新增
            addSubmit: function () {
            this.$refs.addForm.validate(valid => {
              if(valid){
                this.addLoading = true;
                this.$axios.post('/project/add',
                    this.addForm.project_name
                  ).then(response => {
                    // console.log(response);
                  if(response.data.status === 'success'){
                    this.addLoading = false;
                    this.addFormVisible = false;
                    this.addForm.project_name = ''
                    this.$message.success({
                      message:'新增项目成功',
                      center:false
                    })
                    this.filters.id = ''
                    this.filters.project_name = ''
                    this.getProjectList(10,1);
                  }else {
                    this.addLoading = false;
                    this.$message.error({
                      message:'新增项目失败',
                      center:false
                    })
                  }

                }).catch(error => {
                  console.log(error)
                  this.addLoading = false;
                  this.$message.error({
                    message:'新增项目异常',
                    center:false
                  })
                })

              }
            })

            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
               /* let ids = this.sels.map(item => item.id);
                let self = this;
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let self = this;
                    let params = {ids: ids};
                    let header = {
                        "Content-Type": "application/json",
                        Authorization: 'Token ' + JSON.parse(sessionStorage.getItem('token'))
                    };
                    delProject(header, params).then(_data => {
                        let {msg, code, data} = _data;
                        if (code === '999999') {
                            self.$message({
                                message: '删除成功',
                                center: true,
                                type: 'success'
                            })
                        } else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                        self.getProjectList()
                    });
                })*/
            }
        },
        mounted() {
            this.getProjectList(10,1);
        }
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
</style>
