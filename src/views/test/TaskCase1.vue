<template>
  <div class="dashboard-container">

    <el-row :gutter="22">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-card class="box-card">

            <div slot="header" class="clearfix">
              <span>用例信息</span>
              <el-button style="float: right; padding: 3px;margin-left: 3px" type="success">
                切换结果
                <i class="el-icon-sort"></i>
              </el-button>
              <router-link :to="{name: '项目列表'}">
                <el-button style="float: right; padding: 3px 3px" type="primary" icon="el-icon-d-arrow-left">返回列表
                </el-button>
              </router-link>
            </div>

            <template>
              <div style="z-index: 9;float: right;position: relative;">
                <el-button  type="primary" size="mini">执行测试</el-button>
              </div>
              <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="步骤" name="third">



                </el-tab-pane>
                <el-tab-pane label="文档" name="fourth">文档</el-tab-pane>
              </el-tabs>
            </template>


          </el-card>

        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>案例列表</span>
            </div>

            <template>
              <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">

                <el-tab-pane label="接口列表" name="third">
                  <el-form :inline="true" :model="formInline" class="demo-form-inline" size="medium">
                    <el-form-item label="接口名称：">
                      <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                    </el-form-item>
                    <el-form-item label="所属项目：">
                      <el-select v-model="formInline.region" placeholder="活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>

                  </el-form>

                  <el-button type="primary" plain size="mini" style="font-size: 10px;margin-bottom: 10px" icon="el-icon-circle-plus-outline">添加至步骤</el-button>

                  <el-checkbox-group class="checkbox-group" v-model="form.type">
                    <div class="checkbox-item">
                      <el-checkbox  v-for="item in apilist" :label="item.id"   :key="item.id">{{item.name}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-tab-pane>

                <el-tab-pane label="定时任务补偿" name="fourth">文档</el-tab-pane>
              </el-tabs>
            </template>

          </el-card>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    name: 'Dashboard',
    data() {
      return {
        activeName2: 'third',
        form: {
          type: []
        },
        formInline: {
          user: '',
          region: ''
        },
        apilist: []
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      onSubmit() {
        console.log('submit!');
      }

    },
    created(){
        this.$axios.post('/api/all_list',{
          'pageSize' : 40,
          'pageNo' : 1
        })
          .then(response => {
            if(response.data.status === 'success'){
              this.apilist = response.data.apiDTOList;
            }
          })
          .catch(error => {

          })
    },
    mounted(){

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
  margin-bottom: 16px;
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
}
.el-button{
  font-size: 15px;
}
ul li{
  list-style-type:none;
}
.el-form-item {
  margin-bottom: 5px;
}
.checkbox-item {
  /deep/ .el-checkbox {
    display: block;
    margin-left: 0;
  }
  /deep/ .el-checkbox__label{
    font-size: 17px;
  }

}

</style>

