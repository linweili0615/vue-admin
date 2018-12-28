<template>
  <div class="dashboard-container">
    <div class="dashboard-text">日志</div>
    <div style="height:100%;overflow:auto;" class="logdata" id="logdata">
      <ul>
        <li v-for="log in logs">
          <pre>{{ log }}</pre>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Dashboard',
    data() {
      return {
        logs:[],
        task_id:'',
        count:0
      }
    },
    methods:{
      getTaskLog(){
        this.$axios.post('/task/getLog','81598efb-ffa9-11e8-a19c-0242ac110002')
          .then(response => {
            if (response.data.status === 'success'){
              this.logs = response.data.data
              if(this.count < response.data.data.length){
                this.count = response.data.data.length
              }
            } else {
              this.$message.error('获取日志记录错误')
            }
        }).catch(error => {
          console.log(error)
          this.$message.error('获取日志记录异常')
        })
      }
    },
    created(){
      this.task_id = this.$route.query.params.task_id
    },
    mounted(){
      this.getTaskLog()
    },
    updated(){
        this.$nextTick(function(){
          var div = document.getElementById("logdata")
          div.scrollTop = div.scrollHeight
        })
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
.return-list {
  margin-top: 0px;
  margin-bottom: 10px;
}
.head-class {
  font-size: 17px
}
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}
ul li{
  list-style-type:none;
}
.logdata {
  ul {
    margin: 0;
    li {
      padding: 0;
    }
  }
}
</style>
