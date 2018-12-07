<template>
  <div class="dashboard-container">
    <div class="dashboard-text">定时任务</div>
    <template>
      <div style="text-align:center">
        <el-transfer
          style="text-align:left; display:inline-block;width: 100%;"
          v-model="value4"
          filterable
          :left-default-checked="[2, 3]"
          :right-default-checked="[1]"
          :titles="['Source', 'Target']"
          :button-texts="['到左边', '到右边']"
          :format="{
        noChecked:'${total}',
        hasChecked:'${checked}/${total}'
      }"
          @change="handleChange"
          :data="data">
          <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
          <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
          <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
        </el-transfer>
      </div>
    </template>





  </div>
</template>

<script>
  export default {
    data() {
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key:i,
            label:`备选项 ${ i }`,
            disabled:i % 4 === 0
          });
        }
        return data;
      };
      return {
        data:generateData(),
        value3:[1],
        value4:[1],
        renderFunc(h, option) {
          return <span>{ option.key } - { option.label }</span>;
        }
      };
    },

    methods:{
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin:30px;
  }
  &-text {
    font-size:30px;
    line-height:46px;
  }
}
</style>
<style rel="stylesheet/css"  scoped>
  .transfer-footer {
    margin-left:20px;
    padding:6px 5px;
  }
  .el-transfer-panel__body {
    min-height: 500px;
  }
  /deep/ .el-transfer-panel {
    width: 42%;
  }
  /deep/ .el-transfer-panel__body {
    height: 650px;
  }
  /deep/ .el-transfer-panel__list.is-filterable {
    height: 650px;
  }

</style>
