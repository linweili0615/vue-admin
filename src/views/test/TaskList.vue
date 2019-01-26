<template>
  <div class="dashboard-container">

    <el-row :gutter="24">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card class="box-card">

            <div slot="header" class="clearfix">
              <el-form :inline="true"  @submit.native.prevent>
                <el-form-item>
                  <el-input  placeholder="请输入任务ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input  placeholder="请输入任务名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"  @click="">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="">新增任务</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" @click="">暂停所有定时任务</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="success" @click="">启动所有定时任务</el-button>
                </el-form-item>
              </el-form>
            </div>

            <template>
              <el-table
                ref="multipleTable"
                :data="tasklist"
                v-loading="listLoading"
                height="73vh"
                size="medium"
                tooltip-effect="dark"
                empty-text="暂无数据"
                style="width: 100%"
              >
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column
                  label="任务ID"
                  width="300"
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
                  width="240"
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
                  label="启用"
                  width="62"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.status"
                      active-color="#13ce66"
                      inactive-color="#7f8186"
                      active-value="1"
                      inactive-value="-1"
                    >
                    </el-switch>
                  </template>

                </el-table-column>
                <el-table-column
                  prop="trigger_STATE"
                  label="执行状态"
                  width="110"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="update_author"
                  label="修改者"
                  width="100"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="modify_time"
                  label="修改时间"
                  width="160"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="操作" width="280">
                  <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" icon="el-icon-warning" >暂停</el-button>
                    <el-button type="warning" plain size="mini" icon="el-icon-refresh" >恢复</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
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
  </div>
</template>

<script>

  export default {
    data() {

      return {
        listLoading: false,
        tasklist: [],
        total: 10,
        sizes: [50, 80],
        pageSize: 50,
        pageCount: 1,
        page: 1,
        currentpage: 1,
      }
    },
    methods: {
      getTaskList(pageSize,currentpage){
        console.log(pageSize,currentpage)
        this.listLoading = true
        this.$axios.get('/task/list')
          .then(res => {
            if(res.data.status ==='SUCCESS'){
              this.tasklist = res.data.data
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
    },
    computed:{

    },
    mounted() {
      this.getTaskList(50,1)
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
  }
  .el-table {
    /deep/ th{
      padding: 0px 0;
    }
  }
  .el-form-item {
    margin-bottom: 0px;
  }

</style>



