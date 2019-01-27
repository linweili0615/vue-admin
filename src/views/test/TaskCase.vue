<template>
  <div class="dashboard-container">

    <el-row :gutter="22">
      <el-col :span="9">
        <div class="grid-content bg-purple">
          <el-card class="box-card">

            <div
              slot="header"
              class="clearfix"
            >
              <span>任务信息</span>
              <el-button
                style="float: right; padding: 5px;margin-left: 3px"
                type="info"
                @click="showLog"
              >
                查看日志
              </el-button>
              <router-link :to="{name: '任务列表'}">
                <el-button
                  style="float: right; padding: 5px 3px"
                  type="primary"
                  icon="el-icon-d-arrow-left"
                >返回列表
                </el-button>
              </router-link>
            </div>

            <template>
              <el-button
                type="primary"
                size="medium"
                style="position: absolute; right: 18px;z-index: 99"
                :loading="status"
                @click="SendTask"
              >执行测试</el-button>
              <el-tabs
                v-model="activeName1"
                type="card"
                @tab-click="handleClick"
              >
                <el-tab-pane label="步骤" name="step">
                  <el-table
                    ref="multipleTable2"
                    :data="tasklist"
                    row-key="id"
                    height="70vh"
                    size="medium"
                    tooltip-effect="dark"
                    empty-text="暂无数据"
                    style="width: 100%"
                    @selection-change="handleTaskChange"
                  >
                    <el-table-column
                      type="selection"
                      width="30"
                    ></el-table-column>
                    <!--<el-table-column type="index" width="52" label="序号"></el-table-column>-->
                    <el-table-column
                      label="接口名称"
                      width="350"
                    >
                      <template slot-scope="scope">
                        <router-link :to="{ name: '修改API接口', query: { id: scope.row.api_id, project_id: scope.row.project_id, case_id: scope.row.case_id}}">
                          <span style="color:#409EFF">{{scope.row.api_name}}</span>
                        </router-link>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="状态"
                      width="50"
                    >
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
                    <el-table-column label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          plain
                          size="mini"
                          icon="el-icon-circle-plus-outline"
                          @click="drawFunction"
                        >提取</el-button>
                        <el-button
                          type="warning"
                          plain
                          size="mini"
                          icon="el-icon-circle-plus-outline"
                        >检查</el-button>
                        <el-button
                          type="danger"
                          size="mini"
                          icon="el-icon-delete"
                          style="margin-right: 18px;"
                          @click="delTask(scope.row.id)"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="float: right;margin-top: 5px;margin-right: 20px">
                    <el-button
                      type="danger"
                      plain
                      size="mini"
                      :disabled="step_status"
                      @click="deleteTask"
                    >批量删除</el-button>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="配置" name="config">
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
                        style="width: 100%"
                        :picker-options="pickerOptions1">
                      </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结束时间:" prop="end_time">
                      <el-date-picker
                        v-model="ConfigForm.end_time"
                        type="datetime"
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
                                 @click.native="handleConfigStatus(ConfigForm.status)"
                                 active-color="#13ce66"
                                 inactive-color="#7f8186"
                                 active-value="1"
                                 inactive-value="-1"></el-switch>
                    </el-form-item>

                      <el-button type="primary" style="width: 60%; margin:0 auto;display: block;" @click="SaveConfig">更新</el-button>
                  </el-form>

                </el-tab-pane>
              </el-tabs>
            </template>

          </el-card>

        </div>
      </el-col>

      <el-col
        :span="15"
        v-show="activeStatus"
      >
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>API列表</span>
              <el-button
                style="float: right; padding: 5px;margin-left: 3px"
                type="success"
                @click="toTaskResult"
              >
                查看结果
                <i class="el-icon-document"></i>
              </el-button>
            </div>
            <template>
              <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane
                  label="接口列表"
                  name="interface"
                >
                  <el-form :inline="true" class="demo-form-inline" size="medium">
                    <el-form-item label="接口名称：" style="margin-bottom: 10px">
                      <el-input
                        v-model="search.name"
                        placeholder="请输入接口名称"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="所属项目：" style="margin-bottom: 10px">
                      <el-cascader
                        placeholder="搜索：  用户项目"
                        :options="options"
                        @change="handleOptionsChange"
                        filterable
                        change-on-select
                      ></el-cascader>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 10px">
                      <el-button
                        type="primary"
                        @click="onSubmit"
                      >查询</el-button>
                    </el-form-item>

                  </el-form>

                  <el-button
                    type="primary"
                    plain
                    size="medium"
                    style="font-size: 12px"
                    icon="el-icon-circle-plus-outline"
                    @click="addStep"
                  >添加至步骤</el-button>
                  <template>
                    <el-table
                      ref="multipleTable"
                      @row-click="rowClick"
                      :data="apilist"
                      height="61vh"
                      size="medium"
                      tooltip-effect="dark"
                      empty-text="暂无数据"
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                    >
                      <el-table-column
                        type="selection"
                        width="30"
                      ></el-table-column>
                      <!--<el-table-column type="index" width="52" label="序号"></el-table-column>-->
                      <el-table-column
                        prop="name"
                        label="接口名称"
                        width="350"
                      >
                        <template slot-scope="scope">
                          <router-link :to="{ name: 'API接口', query: { id: scope.row.api_id, project_id: scope.row.project_id, case_id: scope.row.case_id}}">
                            <span style="color:#409EFF">{{scope.row.name}}</span>
                          </router-link>
                        </template>

                      </el-table-column>
                      <el-table-column
                        label="请求方式"
                        width="85"
                        show-overflow-tooltip
                      >
                        <template slot-scope="scope">
                          <el-tag
                            type="success"
                            v-if="scope.row.method === 'POST'"
                          >{{ scope.row.method }}</el-tag>
                          <el-tag v-else>{{ scope.row.method }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="paramstype"
                        label="类型"
                        width="48"
                        show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                        prop="url"
                        label="请求地址"
                        width="270"
                        show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                        prop="update_author"
                        label="修改者"
                        width="90"
                        show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                        prop="modify_time"
                        label="修改时间"
                        width="160"
                        show-overflow-tooltip
                      ></el-table-column>

                    </el-table>
                  </template>

                  <div class="block">
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

                </el-tab-pane>
                <!--<el-tab-pane label="测试结果" name="result">文档</el-tab-pane>-->
              </el-tabs>
            </template>

          </el-card>
        </div>
      </el-col>

      <el-col :span="15" v-show="!activeStatus">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>任务执行日志</span>
              <el-button
                style="float: right; padding: 5px;margin-left: 3px"
                type="success"
                @click="toTaskResult"
              >
                查看结果
                <i class="el-icon-document"></i>
              </el-button>
            </div>
            <div
              style="height:100%;overflow:auto;"
              class="logdata"
              id="logdata"
            >
              <ul>
                <li v-for="log in logs">
                  <pre>{{ log }}</pre>
                </li>
              </ul>
            </div>
          </el-card>
        </div>
      </el-col>

    </el-row>
    <!--提取参数弹窗-->
    <el-dialog title="提取参数" :visible.sync="dialogFormVisible">
      <el-form :model="draw">
        <el-form-item
          label="活动名称"
          label-width="120px"
        >
          <el-input v-model="draw.name"></el-input>
        </el-form-item>
        <el-form-item
          label="活动区域"
          label-width="120px"
        >
          <el-select
            v-model="draw.region"
            placeholder="请选择活动区域"
          >
            <el-option
              label="区域一"
              value="shanghai"
            ></el-option>
            <el-option
              label="区域二"
              value="beijing"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible = false"
        >保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Sortable from "sortablejs";
import {cron} from 'vue-cron'
export default {
  components: { cron },
  name: "Dashboard",
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
      cron:'',
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        start_time: [
          { type: 'date', required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        end_time: [
          { type: 'date', required: true, message: '请选择结束时间', trigger: 'blur' },
          { required: true, validator : validateEndTime, trigger: 'blur'}
        ],
        cron: [
          { required: true, message: '请输入定时策略', trigger: 'blur' },
        ],
      },
      ConfigForm: {
        name: '',
        start_time: '',
        end_time: '',
        status: 1,
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
      status: false,
      logs: "",
      options: [],
      step_status: true,
      activeName1: "step",
      activeName2: "interface",
      activeResult: ["1"],
      activeStatus: true,
      api: {
        list: []
      },
      task: {
        list: []
      },
      search: {
        name: ""
      },
      task_id: '',
      project_id: '',
      case_id: '',
      apilist: [],
      tasklist: [],
      deal_list: [],
      total: 0,
      sizes: [50, 80],
      pageSize: 50,
      pageCount: 1,
      page: 1,
      currentpage: 1,
      result_list: [
        {
          code: 502,
          content: "返回内容",
          cookies: "返回cookies",
          headers: "返回headers"
        }
      ],
      dialogFormVisible: false,
      draw: {
        name: "",
        region: ""
      }
    };
  },
  methods: {
    SaveConfig(){
      this.$refs.ConfigForm.validate((valid) => {
        if(valid){
          this.$axios.post('/job/info/update',{
            'task_id': this.task_id,
            'start_time': this.ConfigForm.start_time,
            'end_time': this.ConfigForm.end_time,
            'cron_expression': this.ConfigForm.cron
          })
            .then(res => {
              if(res.data.status ==='SUCCESS'){
                this.$message({
                  type: 'success',
                  duration:1000,
                  message:'任务配置信息已更新'
                })
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                duration:1000,
                message:'任务配置信息更新异常'
              })
            })
        }
      })
    },
    changeCron(val){
      this.ConfigForm.cron=val
    },
    drawFunction() {
      this.dialogFormVisible = true;
    },
    handleConfigStatus(status){
      // console.log(status)
    },
    handleStatus(row) {
      this.deal_list = [row.id];
      console.log(this.deal_list)
      this.$axios
        .post("/task/extend/status", {
          status: row.status,
          list: this.deal_list
        })
        .then(response => {
          if (response.data.status !== "SUCCESS") {
            this.$message.error("更改状态失败！");
            row.status = -row.status;
          }
        })
        .catch(error => {
          this.$message.error("更改状态异常！");
          row.status = -row.status;
        });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    onSubmit() {
      this.getApiList(50, 1);
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
    handleTaskChange(val) {
      if (val.length > 0) {
        let lists = val;
        lists.map(cc => {
          this.task.list.push(cc.id);
        });
      }
      if (this.task.list.length > 0) {
        this.step_status = false;
      } else {
        this.step_status = true;
      }
    },
    rowClick(row, event, column) {
      if (event.target.nodeName != "INPUT") {
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
      this.api.list = [];
    },
    addStep() {
      if (this.api.list.length > 0) {
        // console.log(this.api.list);
        this.$axios
          .post("/task/extend/add", {
            list: this.api.list,
            task_id: this.task_id
          })
          .then(response => {
            if (response.data.status === "SUCCESS") {
              this.$message({
                type: "success",
                duration: 1000,
                message: "已添加至步骤"
              });
              this.getTaskList();
              this.toggleSelection();
            } else {
              this.$message.error("添加至步骤失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$message.info("请选择任意接口再进行添加");
      }
    },
    delTask(id) {
      if (id) {
        this.$confirm("是否确定删除该记录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .post("/task/extend/del", [id])
              .then(response => {
                if (response.data.status === "success") {
                  this.$message.success("记录已删除");
                  this.tasklist.map((value, index) => {
                    if (value.id === id) {
                      this.tasklist.splice(index, 1);
                    }
                  });
                }
              })
              .catch(error => {
                this.$message.error("删除异常");
              });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getTaskLog() {
      this.$axios
        .post("/task/getLog", this.task_id)
        .then(response => {
          this.logs = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    showLog() {
      this.activeStatus = !this.activeStatus;
      if (!this.activeStatus) {
        this.getTaskLog();
      }
    },
    toTaskResult(row, event, column) {
      let routeData = this.$router.resolve({
        path: "/api/task/result",
        query: {
          task_id: this.task_id,
          u_id: "81598efb-ffa9-11e8-a19c-0242ac110002"
        }
      });
      window.open(routeData.href, "_blank");

    },
    SendTask() {
      this.status = true;
      this.activeStatus = false;
      let intervaljob = setInterval(this.getTaskLog, 500);
      this.$axios
        .post("/task/test", this.task_id)
        .then(response => {
          this.status = false;
          if (response.data.status === "SUCCESS") {
            this.result_list = response.data.data;
            clearInterval(intervaljob);
            this.$confirm("是否跳转结果页？", "任务执行成功", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                let routeData = this.$router.resolve({
                  path: "/api/task/result",
                  query: { task_id: this.task_id }
                });
                window.open(routeData.href, "_blank");
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            clearInterval(intervaljob);
            this.status = false;
            this.$message.error(response.data.msg);
          }
        })
        .catch(error => {
          clearInterval(intervaljob);
          this.status = false;
          console.log(error);
          this.$message.error("执行异常");
        });
    },
    deleteTask() {
      if (this.task.list) {
        this.$confirm("是否确定批量删除记录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .post("/task/extend/del", this.task.list)
              .then(response => {
                if (response.data.status === "SUCCESS") {
                  this.task.list = [];
                  this.step_status = true;
                  this.getTaskList();
                }
              })
              .catch(error => {
                this.$message.error("删除异常");
              });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getTaskList() {
      this.$axios
        .post("/task/extend/info", this.task_id)
        .then(response => {
          if (response.data.status === "SUCCESS") {
            if (response.data.data) {
              this.tasklist = response.data.data;
              this.$nextTick(() => {
                this.setSort();
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setSort() {
      const el = document.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          this.$axios
            .post("/task/extend/deal", {
              old_id: this.tasklist[evt.oldIndex].id,
              old_rank: this.tasklist[evt.oldIndex].rank,
              new_id: this.tasklist[evt.newIndex].id,
              new_rank: this.tasklist[evt.newIndex].rank
            })
            .then(response => {
              if (response.data.status === "SUCCESS") {
                this.task.list = [];
                this.step_status = true;
                const targetRow = this.tasklist.splice(evt.oldIndex, 1)[0];
                this.tasklist.splice(evt.newIndex, 0, targetRow);
              } else {
                this.$message.info("更改任务详情顺序失败");
              }
            })
            .catch(error => {
              console.log(error);
              this.$message.error("更改任务详情顺序异常");
            });
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getApiList(this.pageSize, 1);
    },
    handleCurrentChange(val) {
      this.currentpage = val;
      this.getApiList(this.pageSize, this.currentpage);
    },
    getApiList(pageSize, pageNo) {
      this.$axios
        .post("/api/all_list", {
          pageSize: pageSize,
          pageNo: pageNo,
          project_id: this.project_id,
          case_id: this.case_id,
          name: this.search.name
        })
        .then(response => {
          if (response.data.status === "SUCCESS") {
            this.apilist = response.data.apiDTOList;
            this.total = response.data.total;
            this.pageSize = response.data.pageSize;
            this.pageNo = response.data.pageNo;
            this.pageCount = response.data.pageCount;
          }
        })
        .catch(error => {});
    },
    getApiTree() {
      this.$axios
        .post("/case/list")
        .then(response => {
          if (response.data.status === "SUCCESS") {
            this.options = response.data.data;
          } else {
            this.options = [];
            this.$message.error("获取测试集失败");
          }
        })
        .catch(error => {
          this.options = [];
          this.$message.error("获取测试集失败");
        });
    },
    handleChange(val) {
      // console.log(val);
    },
    handleOptionsChange(val) {
      if (val.length > 0) {
        this.project_id = val[0];
        if (val.length === 2) {
          this.case_id = val[1];
        }
      }
    }
  },
  created() {

    if(this.$route.query.id===''){
      this.$router.push({path: '/404'})
    }
    this.task_id = this.$route.query.id
  },
  mounted(){
    this.getTaskList();
    this.getApiTree();
    this.getApiList(50, 1);
  },
  updated() {
    this.$nextTick(function() {
      var div = document.getElementById("logdata");
      div.scrollTop = div.scrollHeight;
    });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 15px 20px 15px 20px;
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
  clear: both;
}

.box-card {
  width: 100%;
  height: 91vh;
  /deep/ .el-card__body {
    padding: 10px;
    height: 85vh;
    position: relative;
  }
}
.checkbox-item {
  padding-right: 5px;
  /deep/ .el-checkbox {
    display: block;
    margin-left: 0;
  }
  /deep/ .el-checkbox__label {
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
.el-button--mini,
.el-button--mini.is-round {
  padding: 4px 4px;
  font-size: 14px;
  margin-left: 0px;
}
.el-table--medium {
  /deep/ td,
  th {
    padding: 4px 0;
  }
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

