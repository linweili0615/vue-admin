<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span style="font-size: x-large;">自动化测试报告</span>
          <p style="margin: 5px;">
            <span>开始时间：2018-01-17 14:28</span>
            <span>执行时长：16秒</span>
            <span>结束时间：2018-01-17 14:30</span>
            <span>任务ID：561FDS-154FSDF-FDS545SDF-1541FDS</span>
            <span>执行者：linweili</span>
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <div class="grid-content bg-purple-light">
          <span class="failue">失败</span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="normal">总数：128</span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="normal">通过：120</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <span class="failue">失败：8</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <span class="normal">通过率：98 %</span>
        </div>
      </el-col>
    </el-row>

    <div style="margin-top: 20px">
      <template>
        <el-table
          :data="tableData5"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="请求参数">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <el-form-item label="返回参数">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="API"
            prop="id">
          </el-table-column>
          <el-table-column
            label="接口名称"
            prop="name">
          </el-table-column>
          <el-table-column
            label="测试结果"
            prop="desc">
          </el-table-column>
        </el-table>
      </template>
    </div>



  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData5: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          desc: '通过',
          address: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          desc: '通过',
          address: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          shop: '王小虎夫妻店',
          shopId: '10333'
        },{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          desc: '失败',
          address: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          shop: '王小虎夫妻店',
          shopId: '10333'
        },{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          desc: '通过',
          address: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          shop: '王小虎夫妻店',
          shopId: '10333'
        },{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          desc: '失败',
          address: {
            url: 'fds',
            method: 'get',
            params: {
              tdfrom: 'fds',
              type: '1'
            }
          },
          shop: '王小虎夫妻店',
          shopId: '10333'
        },]
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
}
.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}

.bg-purple {
  background: #d3dce6;
}
.bg-purple-dark {
  background: #252222;
}
.bg-purple-light {
  background: #e4e4e4;
}
.failue{
  color: red
}
.normal{
  color: black;
}
.grid-content {
  margin: 0px;
  padding: 5px 10px 5px 10px;
  color: white;
  min-height: 36px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<style lang="scss">
  .selectInput{
    input{
      border-right: 0px;
      border-radius: 4px 0px 0px 4px;
    }
  }
</style>
