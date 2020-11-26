<template>
  <div class="home">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="form">
      <el-form-item label="用户名" prop="name" required>
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="年龄" prop="age" required>
        <el-input v-model.number="form.age" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">立即创建</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="memberList" stripe class="table" v-loading="loading">
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        width="120">
      </el-table-column>
      <el-table-column
        prop="date"
        label="新增时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date | fmtDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="90">
        <template slot-scope="scope">
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="确定删除这一项么？"
            @confirm="deleteItem(scope.row)"
          >
            <i slot="reference" class="el-icon-delete" />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      form: {},
      memberList: [],
      loading: false,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '年龄不能为空'},
          { type: 'number', message: '年龄必须为数字值'}
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      const res = await this.$api.getMemberList()
      setTimeout(() => {
        this.loading = false
      }, 500)
      if(+res.code !== 200) {
        this.$message.error(res.msg || '系统繁忙，请稍后再试！');
        return
      }
      this.memberList = res.data || []
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.onSubmit()
        }
      })
    },
    async onSubmit() {
      const params = this.$tools.util.deepClone({}, this.form)
      const res = await this.$api.insertMember(params)
      if(+res.code !== 200) {
        this.$message.error(res.msg || '系统繁忙，请稍后再试！');
        return
      }
      this.$message.success('新增成功')
      this.onReset()
      this.init()
    },
    async deleteItem(item) {
      const res = await this.$api.deleteMember({id: item._id})
      if(+res.code !== 200) {
        this.$message.error(res.msg || '系统繁忙，请稍后再试！');
        return
      }
      this.$message.success('删除成功')
      this.init()
    },
    onReset() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang="stylus">
  .form
    width 450px
    margin 50px auto
  .table
    width 600px
    margin 50px auto
</style>
