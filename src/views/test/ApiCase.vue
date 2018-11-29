<template>
    <section>
      <el-row class="row-title">
        <el-col :span="6">
          <!--新增-->
          <el-dialog title="新增分组" :visible.sync="addGroupFormVisible" :close-on-click-modal="false" style="width: 60%; left: 20%">
            <el-form :model="addGroupForm" label-width="80px"  :rules="addGroupFormRules" ref="addGroupForm">
              <el-form-item label="分组名称" prop='firstgroup'>
                <el-input v-model.trim="addGroupForm.firstgroup" auto-complete="off" style="width: 90%"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="addGroupFormVisible = false">取消</el-button>
              <el-button type="primary" @click.native="addGroupSubmit" :loading="addGroupLoading">提交</el-button>
            </div>
          </el-dialog>
          <div class="grid-content bg-purple">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input><br/>

            <el-tree
              class="filter-tree"
              :data="data2"
              :props="defaultProps"
              default-expand-all
              :filter-node-method="filterNode"
              ref="tree2">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="16" :offset="2">
          <div class="grid-content bg-purple-light">
            <el-col :span="24" style="height: 46px">
              <el-form :inline="true" :model="filters" @submit.native.prevent>
                <el-form-item>
                  <el-input v-model.trim="filters.name" placeholder="名称"></el-input>
                  <!--<el-input v-model.trim="filters.name" placeholder="名称" @keyup.enter.native="getApiList"></el-input>-->
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">查询</el-button>
                  <!--<el-button type="primary" @click="getApiList">查询</el-button>-->
                </el-form-item>
                <el-form-item>
                 <!-- <router-link :to="{ name: '新增接口', params: {project_id: this.$route.params.project_id}}" style='text-decoration: none;color: aliceblue;'>
                    <el-button type="primary">新增</el-button>
                  </router-link>-->
                  <el-button type="primary">新增</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="update">修改分组</el-button>
                  <!--<el-button type="primary" :disabled="update" @click="changeGroup">修改分组</el-button>-->
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.native="DownloadApi">下载接口文档</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.native="loadSwaggerApi = true">导入接口</el-button>
                  <el-dialog title="导入swagger接口" :visible.sync="loadSwaggerApi" :close-on-click-modal="false">
                    <el-input v-model.trim="swaggerUrl" placeholder="请输入swagger接口地址" style="width:90%"></el-input>
                    <el-button type="primary" @click="addSubmit" :loading="addLoading">导入</el-button>
                    <P v-if="!swaggerUrl" style="color: red; margin: 0px">不能为空</P>
                  </el-dialog>
                </el-form-item>
              </el-form>
              <!--列表-->
              <el-table :data="api" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="selection" min-width="5%">
                </el-table-column>
                <el-table-column prop="name" label="接口名称" min-width="17%" sortable show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-icon name="name"></el-icon>
                    <router-link :to="{ name: '基础信息', params: {api_id: scope.row.id}}" style='text-decoration: none;'>{{ scope.row.name }}</router-link>
                  </template>
                </el-table-column>
                <el-table-column prop="requestType" label="请求方式" min-width="11%" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="apiAddress" label="接口地址" min-width="19%" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="userUpdate" label="最近更新者" min-width="13%" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="更新日期" min-width="15%" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="Mock" min-width="7%">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.mockStatus" type="success" size="small" @click="checkMockStatus(scope.row)">关闭</el-button>
                    <el-button v-if="!scope.row.mockStatus" type="info" size="small"  @click="checkMockStatus(scope.row)">启动</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="13%">
                  <template slot-scope="scope">
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <router-link :to="{ name: '修改', params: {api_id: scope.row.id}}" style='text-decoration: none;color: aliceblue;'>
                      <el-button type="info" size="small">修改</el-button>
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
              <el-col :span="24" class="toolbar">
                <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :page-count="total" style="float:right;">
                </el-pagination>
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
              project: "",
              groupData: [],
              addGroupFormVisible: false,
              addGroupLoading: false,
              addFormVisible: false,//新增界面是否显示
              addGroupFormRules: {
                firstgroup: [
                  { required: true, message: '请输入子分组名称', trigger: 'blur' },
                  // { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ]
              },
              //新增界面数据
              addGroupForm: {
                firstgroup: '',
              },
              editFirstGroupFormVisible: false,
              editFirstGroupLoading: false,
              editFirstFormVisible: false,//编辑界面是否显示
              editFirstGroupFormRules: {
                secondFirstGroup: [
                  { required: true, message: '请输入分组名称', trigger: 'blur' },
                  // { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ]
              },
              filters: {
                name: ''
              },
              api: [],
              total: 0,
              page: 1,
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
              data2: [
                /*{
                id: 1,
                label: '一级 1',
                children: [{
                  id: 4,
                  label: '二级 1-1',
                  children: [{
                    id: 9,
                    label: '三级 1-1-1'
                  }, {
                    id: 10,
                    label: '三级 1-1-2'
                  }]
                }]
              }, {
                id: 2,
                label: '一级 2',
                children: [{
                  id: 5,
                  label: '二级 2-1'
                }, {
                  id: 6,
                  label: '二级 2-2'
                }]
              }, {
                id: 3,
                label: '一级 3',
                children: [{
                  id: 7,
                  label: '二级 3-1'
                }, {
                  id: 8,
                  label: '二级 3-2'
                }]
              }*/
              ],
              defaultProps: {
                children: 'children',
                label: 'label'
              }
            }
        },
        watch: {
          filterText(val) {
            this.$refs.tree2.filter(val);
          }
        },
        methods: {
          getApiList(){
            //获取api分组列表
            if(this.project === ''){
              this.$router.push({
                path: '/404'
              })
            }

            this.$axios.post('/case/list',
              this.project
            )
              .then(response => {
                  console.log(response)
                if(response.data.status === 'success'){
                  this.data2 = response.data.data.caseExtends
                }
              })
              .catch(error => {

              })

          },
          filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
          },
          addSubmit(){
            let self = this;
            this.addLoading = true;
            console.log(this.swaggerUrl);
            if (this.swaggerUrl){
              /*$.ajax({
                          type: "post",
                          url: test+"/api/api/lead_swagger",
                          async: true,
                          data:JSON.stringify({ project_id: Number(this.$route.params.project_id), url: this.swaggerUrl}),
                          headers: {
                              "Content-Type": "application/json",
                              Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                          },
                          timeout: 5000,
                          success: function(data) {
                              if (data.code === '999999') {
                                  self.$message({
                                      message: '添加成功',
                                      center: true,
                                      type: 'success'
                                  });
                                  self.listLoading = true;
                                  self.addLoading = false;
                                  self.loadSwaggerApi = false;
                                  self.getApiList()
                              }
                              else {
                                  self.addLoading = false;
                                  self.$message.error({
                                      message: "导入失败，请检查地址是否正确",
                                      center: true,
                                  })
                              }
                              self.getApiList();
                          },
                      })*/
            } else {
              this.addLoading = false
            }
          },
          // 添加分组弹窗显示
          handleAddGroup() {
            this.addGroupFormVisible = true;
          },
          // 翻页
          handleCurrentChange(val) {
            this.page = val;
            this.getApiList()
          },
          selsChange: function (sels) {
            if (sels.length>0) {
              this.sels = sels;
              this.update = false
            } else {
              this.update = true
            }
          },
          //批量删除
          batchRemove: function () {
            let ids = this.sels.map(item => item.id);
            let self = this;
            this.$confirm('确认删除选中记录吗？', '提示', {
              type: 'warning'
            }).then(() => {
              self.listLoading = true;
              //NProgress.start();
              /*$.ajax({
                  type: "post",
                  url: test+"/api/api/del_api",
                  async: true,
                  data:JSON.stringify({ project_id: Number(this.$route.params.project_id), ids: ids}),
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
                  },
                  timeout: 5000,
                  success: function(data) {
                      self.listLoading = false;
                      if (data.code === '999999') {
                          self.$message({
                              message: '删除成功',
                              center: true,
                              type: 'success'
                          })
                      }
                      else {
                          self.$message.error({
                              message: data.msg,
                              center: true,
                          })
                      }
                      self.getApiList();
                  },
              })*/
            }).catch(() => {
            });
          }
        },
        mounted() {
          this.project = this.$route.params.id
          this.getApiList();

        }
    }

</script>

<style lang="scss" scoped>
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
</style>
