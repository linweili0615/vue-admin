<template>
  <div class="dashboard-container">
    <el-row :gutter="22">

      <el-col :span="4">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
          empty-text="no data"
          class="filter-tree"
          :data="data2"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree2">
        </el-tree>
      </el-col>

      <el-col :span="18">
        <el-form :model="formInline" inline-message label-width="100px" class="demo-form-inline">
          <el-row>
            <el-col :span="4">
            <el-form-item >
                <el-select v-model="formInline.region" placeholder="请选择请求方法">
                  <el-option label="POST" value="POST"></el-option>
                  <el-option label="GET" value="GET"></el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span="20">
            <el-form-item prop="name" label="请求地址：">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="请求头部" name="2">
                <el-table :data="tableData" class="tb-edit" style="width: 100%" highlight-current-row @row-click="handleCurrentChange">
                  <el-table-column label="参数名" width="350">
                    <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.date" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="参数值" width="550">
                    <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.name" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item title="请求参数" name="2">
                <el-table :data="tableData" class="tb-edit" style="width: 100%" highlight-current-row @row-click="handleCurrentChange">
                  <el-table-column label="参数名" width="350">
                    <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.date" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="参数值" width="550">
                    <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.name" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item title="响应结果" name="3">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
              </el-collapse-item>
        </el-collapse>
          </el-form-item>
        </el-form>


      </el-col>

    </el-row>
  </div>
</template>

<script>
export default {
  name: 'test',
  data() {
    return {
      ruleForm: {
        name: '',
      },
      formInline: {
        user: '',
        region: 'GET',
      },
      activeNames: ['2'],
      tableData: [{
        date: '',
        name: ''
      }],
      filterText: '',
      data2: [{
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
      }],
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
    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget)
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleChange(val) {
      console.log(val);
    },
    onSubmit() {
      console.log('submit!');
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }


  }
}
</script>

<style rel="stylesheet/css" lang="css" scope>
.dashboard-container {
    margin: 30px;
  }
.dashboard--text {
    font-size: 30px;
    line-height: 46px;
}
</style>
