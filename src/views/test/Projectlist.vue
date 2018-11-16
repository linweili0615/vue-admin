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
                  @row-click="handleclick"
                  border
                  height="700"
                  @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="index" min-width="2%" label="序号"></el-table-column>
            <el-table-column prop="id" min-width="23%" label="项目ID"></el-table-column>
            <el-table-column prop="project_name" label="项目名称" min-width="16%" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="author" label="创建人" min-width="8%" sortable></el-table-column>
            <el-table-column prop="update_author" label="最后修改人" min-width="8%" sortable></el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="10%" sortable></el-table-column>
            <el-table-column prop="modify_time" label="最后修改时间" min-width="10%" sortable></el-table-column>
            <el-table-column prop="status" label="状态" min-width="6%" sortable></el-table-column>
            <el-table-column label="操作" min-width="19%">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="(scope.$index, scope.row)">删除</el-button>
                    <el-button type="info" size="small" @click="handleChangeStatus(scope.$index, scope.row)">{{scope.row.status===false?'启用':'禁用'}}</el-button>
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
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="类型" prop='type'>
                            <el-select v-model="editForm.type" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="版本号" prop='version'>
                            <el-input v-model="editForm.version" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="描述" prop='description'>
                    <el-input type="textarea" :rows="6" v-model="editForm.description"></el-input>
                </el-form-item>
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
                options: [{ label: "Web", value: "Web"}, { label: "App", value: "App"}],
                editFormRules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    version: [
                        { required: true, message: '请输入版本号', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    description: [
                        { required: false, message: '请输入描述', trigger: 'blur' },
                        { max: 1024, message: '不能超过1024个字符', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    version: '',
                    type: '',
                    description: ''
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
              console.log(index, row)
                /*this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let self = this;
                    let params = {ids: [row.id, ]};
                    let header = {
                        "Content-Type": "application/json",
                        Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                    };
                    delProject(header, params).then(_data => {
                        let { msg, code, data } = _data;
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
            },
            //点击行响应
            handleclick: function(row, event, column){
              // console.log(row, event, column)
            },
           /* handleClose(){
              this.addForm.project_name = ''
            },*/
            // 改变项目状态
            handleChangeStatus: function(index, row) {
              console.log(index, row)
                /*let self = this;
                this.listLoading = true;
                let params = { project_id: row.id};
                let headers = {
                    "Content-Type": "application/json",
                    Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                };
                if (row.status) {
                    disableProject(headers, params).then(_data => {
                        let { msg, code, data } = _data;
                        self.listLoading = false;
                        if (code === '999999') {
                            self.$message({
                                message: '禁用成功',
                                center: true,
                                type: 'success'
                            });
                            row.status = !row.status;
                        }
                        else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                    });
                } else {
                    enableProject(headers, params).then(_data => {
                        let { msg, code, data } = _data;
                        self.listLoading = false;
                        if (code === '999999') {
                            self.$message({
                                message: '启用成功',
                                center: true,
                                type: 'success'
                            });
                            row.status = !row.status;
                        }
                        else {
                            self.$message.error({
                                message: msg,
                                center: true,
                            })
                        }
                    });
                }*/
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
              console.log(index,row)
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
            },
            //编辑
            editSubmit: function () {
                /*let self = this;
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.editLoading = true;
                            //NProgress.start();
                            let params = {
                                project_id: self.editForm.id,
                                name: self.editForm.name,
                                type: self.editForm.type,
                                version: self.editForm.version,
                                description: self.editForm.description
                            };
                            let header = {
                                "Content-Type": "application/json",
                                Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                            };
                            updateProject(header, params).then(_data => {
                                let {msg, code, data} = _data;
                                self.editLoading = false;
                                if (code === '999999') {
                                    self.$message({
                                        message: '修改成功',
                                        center: true,
                                        type: 'success'
                                    });
                                    self.$refs['editForm'].resetFields();
                                    self.editFormVisible = false;
                                    self.getProjectList()
                                } else if (code === '999997'){
                                    self.$message.error({
                                        message: msg,
                                        center: true,
                                    })
                                } else {
                                    self.$message.error({
                                        message: msg,
                                        center: true,
                                    })
                                }
                            });
                        });
                    }
                });*/
            },
            //新增
            addSubmit: function () {
            this.$refs.addForm.validate(valid => {
              if(valid){
                this.addLoading = true;
                this.$axios.post('/project/add',{
                    'project_name' : this.addForm.project_name
                  }).then(response => {
                    console.log(response);
                  if(response.data.status === 'success'){
                    this.addLoading = false;
                    this.addFormVisible = false;
                    this.$message.success({
                      message:'新增项目成功',
                      center:false
                    })
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



                /*this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        let self = this;
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            self.addLoading = true;
                            //NProgress.start();
                            let params = JSON.stringify({
                                name: self.addForm.name,
                                type: self.addForm.type,
                                version: self.addForm.version,
                                description: self.addForm.description
                            });
                            let header = {
                                "Content-Type": "application/json",
                                Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                            };
                            addProject(header, params).then(_data => {
                                let {msg, code, data} = _data;
                                self.addLoading = false;
                                if (code === '999999') {
                                    self.$message({
                                        message: '添加成功',
                                        center: true,
                                        type: 'success'
                                    });
                                    self.$refs['addForm'].resetFields();
                                    self.addFormVisible = false;
                                    self.getProjectList()
                                } else if (code === '999997') {
                                    self.$message.error({
                                        message: msg,
                                        center: true,
                                    })
                                } else {
                                    self.$message.error({
                                        message: msg,
                                        center: true,
                                    });
                                    self.$refs['addForm'].resetFields();
                                    self.addFormVisible = false;
                                    self.getProjectList()
                                }
                            })
                        });
                    }
                });*/
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
            // this.getProjectList(this.pagesize,this.currentpage);
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
