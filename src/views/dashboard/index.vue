<template>
  <div class="dashboard-container">
    <div class="dashboard-text">首页</div>
    <!--<div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->



  </div>
</template>

<script>
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
.return-list {
  margin-top: 0px;
  margin-bottom: 10px;
  /*border-radius: 25px;*/
}
.head-class {
  font-size: 17px
}
.parameter-a {
  display: block;
}
.parameter-b {
  display: none;
}
.selectInput {
  position: absolute;
  padding-left: 9px;
  width: 180px;
  left: 1px;
  border-right: 0px;
}
.raw {
  border: 1px solid #e6e6e6;
  margin-bottom: 10px;
  padding:15px;
  text-align: center
}
.HOST {
  position: absolute;
  right: 10px;
  top: 0px;
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
