<template>
  <section>
    <a-page-header
      style='border: 1px solid rgb(235, 237, 240)'
      title='返回'
      @back='$router.back()'
    />
    <a-divider>编辑用户信息</a-divider>
    <a-form :form='form' :label-col='{ span: 5 }' :wrapper-col='{ span: 12 }' @submit='handleSubmit'>
      <a-form-item label='姓名'>
        <a-input
          v-decorator="['name', {initialValue: userInfo.name, rules: [{ required: true, message: 'Please input your name!' }] }]"
        />
      </a-form-item>
      <a-form-item label='英文名'>
        <a-input
          v-decorator="['name_en', {initialValue: userInfo.name_en, rules: [{ required: true, message: 'Please input your name!' }] }]"
        />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='城域'>
        <a-select v-decorator="['position', { initialValue: Number(userInfo.position) }]">
          <a-select-option v-for='(item, index) in path.position' :key='index' :value='item.id'>
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='公司'>
        <a-select v-decorator="['attribution', { initialValue: Number(userInfo.attribution) }]">
          <a-select-option v-for='(item, index) in path.attribution' :key='index' :value='item.id'>
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='办公室'>
        <a-select v-decorator="['branch', { initialValue: Number(userInfo.branch) }]">
          <a-select-option v-for='(item, index) in path.branch' :key='index' :value='item.id'>
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='部门'>
        <a-select v-decorator="['department', { initialValue: Number(userInfo.department) }]">
          <a-select-option v-for='(item, index) in path.department' :key='index' :value='item.id'>
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col='{ span: 12, offset: 5 }'>
        <a-button type='primary' html-type='submit'>
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </section>
</template>

<script>
export default {
  name: 'user-edit',
  data() {
    return {
      formLayout: 'horizontal',
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      form: this.$form.createForm(this, { name: 'coordinated' }),
      path: {},
      userInfo: {}
    }
  },
  async beforeCreate() {
    let { id } = this.$route.query
    let [path, user] = await Promise.all([
      this.$axios.$get(this.$store.state.api.getPath),
      this.$axios.$get(this.$store.state.api.getFindOne, { params: { id } })
    ])
    this.path = path.result
    this.userInfo = user.result
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.postEditUser(values)
        }
      })
    },
    async postEditUser(user) {
      let { id } = this.$route.query
      try {
        let result = await this.$axios.$post(this.$store.state.api.updateUser, { data: user }, {
          params: {
            id
          }
        })
        if (result && result.statusCode == 200) {
          this.$message.info('修改成功！')
          this.$router.push('/users')
        }
      } catch (e) {
        this.$message.info('增加出错！')
      }

    }
  }
}
</script>
