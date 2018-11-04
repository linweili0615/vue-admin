<template>
  <div class="dashboard-container">

    <el-row :gutter="20">
      <el-col :span="20" >
        <el-form ref="form" :model="sizeForm" label-width="80px" size="normal">

          <el-form-item label="接口名称">
            <el-col :span="15">
            <el-input v-model="sizeForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="请求URL">
            <el-col :span="15">
              <el-input v-model="sizeForm.name"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="请求方式">
            <el-col :span="3">
              <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="请求头部">
            <el-col :span="3">
              <el-button type="primary" size="medium" @click="onSubmit">新增请求头部</el-button>
            </el-col>
            <template >
              <el-table v-show="false"
                :data="tableData"
                style="width: 40%">
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="del(tableData[index])" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-form-item>

          <el-form-item label="请求参数">
            <el-col :span="3">
              <el-button type="primary" size="medium" @click="onSubmit">新增请求参数</el-button>
            </el-col>
            <el-select v-show="false" v-model="sizeForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <template>
              <el-table
                :data="tableData"
                style="width: 40%">
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="del(tableData[index])" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-form-item>

          <el-form-item size="large">
            <el-button type="success" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>






  </div>
</template>

<script>
  export default {
    name: "VueArrays_32",
    data(){
      return {
        sizeForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
        }, {
          date: '2016-05-04',
          name: '王小虎',
        }, {
          date: '2016-05-01',
          name: '王小虎',
        }, {
          date: '2016-05-03',
          name: '王小虎',
        }]

      }
    },
    methods:{
      onSubmit() {
        console.log('submit!');
      },
      del(index){
        this.tableData.splice(index, 1);
      }
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
