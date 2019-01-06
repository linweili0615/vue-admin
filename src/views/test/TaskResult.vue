<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span style="font-size: x-large;">自动化测试报告</span>
          <p style="margin-top: 20px;">
            <span class="report">开始时间: 2018-01-17 14:28:356</span>
            <span class="report">执行时长: 16秒</span>
            <span class="report">结束时间: 2018-01-17 14:30:245</span>
            <span class="report">任务ID: 561FDS-154FSDF-FDS545SDF-1541FDS</span>
            <span class="report">执行者: linweili</span>
          </p>
        </div>
      </el-col>
    </el-row>
    <el-row class="bg-purple-light">
      <el-col :span="6" ><div class="grid-content"><span class="failue">失败</span></div></el-col>
      <el-col :span="3"><div class="grid-content "><span class="normal">总数：</span><span class="digical">128</span></div></el-col>
      <el-col :span="3"><div class="grid-content"><span class="normal">通过：</span><span class="digical-success">120</span></div></el-col>
      <el-col :span="3"><div class="grid-content"><span class="normal">失败：</span><span class="digical-failue">8</span></div></el-col>
      <el-col :span="5"><div class="grid-content"><span class="normal">通过率：</span><span class="digical">98 %</span></div></el-col>
    </el-row>

    <div style="margin-top: 20px">
      <template>
        <el-table
          :data="tableData5"
          style="width: 100%">
          <el-table-column type="index" width="30"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="请求参数: ">
                  <pre>{{ props.row.category }}</pre>
                </el-form-item>
                <el-form-item label="返回参数: ">
                  <pre>{{ props.row.address }}</pre>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="API" prop="id" width="280"></el-table-column>
          <el-table-column label="接口名称" prop="name" width="280"></el-table-column>
          <el-table-column prop="url" label="请求地址" width="300" show-overflow-tooltip></el-table-column>
          <el-table-column  label="请求方式" width="85" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag type="success" v-show="scope.row.method === 'POST'">{{ scope.row.method }}</el-tag>
              <el-tag v-show="scope.row.method === 'GET'">{{ scope.row.method }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="测试结果" prop="desc" width="80"></el-table-column>
          <el-table-column
            label="开始时间"
            prop="start_time">
          </el-table-column>
          <el-table-column
            label="结束时间"
            prop="end_time">
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
          id: '1da3d5ee-4cca-4f14-8fe3-8e27d8c46ef5',
          name: '好滋好味鸡蛋仔',
          method: 'GET',
          url: 'https://passport.tuandai.com/2login',
          start_time: '2019-01-06 14:43:46:234',
          end_time: '2019-01-06 14:43:50:448',
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
          id: '1da3d5ee-4cca-4f14-8fe3-8e27d8c46ef5',
          name: '好滋好味鸡蛋仔',
          method: 'POST',
          url: 'https://passport.tuandai.com/2login',
          start_time: '2019-01-06 14:43:46:234',
          end_time: '2019-01-06 14:43:50:448',
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
          id: '1da3d5ee-4cca-4f14-8fe3-8e27d8c46ef5',
          name: '好滋好味鸡蛋仔',
          url: 'https://passport.tuandai.com/2login',
          method: 'POST',
          start_time: '2019-01-06 14:43:46:234',
          end_time: '2019-01-06 14:43:50:448',
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
          id: '1da3d5ee-4cca-4f14-8fe3-8e27d8c46ef5',
          name: '好滋好味鸡蛋仔',
          url: 'https://passport.tuandai.com/2login',
          method: 'GET',
          start_time: '2019-01-06 14:43:46:234',
          end_time: '2019-01-06 14:43:50:448',
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
          id: '1da3d5ee-4cca-4f14-8fe3-8e27d8c46ef5',
          name: '好滋好味鸡蛋仔',
          method: 'POST',
          url: 'https://passport.tuandai.com/2login',
          start_time: '2019-01-06 14:43:46:234',
          end_time: '2019-01-06 14:43:50:448',
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
  line-height: 50px;
}
.failue{
  color: red;
  font-size: 40px;
}
.normal{
  color: black;
}
.grid-content {
  margin: 0px;
  padding: 20px 10px 2px 20px;
  color: white;
  min-height: 36px;
  .report{
    font-size: 15px;
    margin-right: 30px;
    color: #d3dce6;
  }
  .digical{
    font-size: 30px;
    color: black;
    &-failue{
      font-size: 30px;
      color: red;
    }
    &-success{
      font-size: 30px;
      color: #67c23a;
    }
  }
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
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;

}
.el-form-item {
  /deep/ .el-form-item__content {
   line-height: 100%;
  }
}

</style>
