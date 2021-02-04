<template>
  <a-form :form='form' :label-col='{ span: 5 }' :wrapper-col='{ span: 12 }' @submit='handleSubmit'>
    <a-form-item label='姓名'>
      <a-input
        v-decorator="['name', { rules: [{ required: true, message: 'Please input your name!' }] }]"
      />
    </a-form-item>
    <a-form-item label='英文名'>
      <a-input
        v-decorator="['name_en', { rules: [{ required: true, message: 'Please input your name!' }] }]"
      />
    </a-form-item>
    <a-form-item v-bind='formItemLayout' label='城域'>
      <a-select v-decorator="['position', { initialValue: 1 }]">
        <a-select-option v-for='(item, index) in path.position' :key='index' :value='item.id'>
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-bind='formItemLayout' label='公司'>
      <a-select v-decorator="['attribution', { initialValue: 1 }]">
        <a-select-option v-for='(item, index) in path.attribution' :key='index' :value='item.id'>
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-bind='formItemLayout' label='办公室'>
      <a-select v-decorator="['branch', { initialValue: 1 }]">
        <a-select-option v-for='(item, index) in path.branch' :key='index' :value='item.id'>
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-bind='formItemLayout' label='部门'>
      <a-select v-decorator="['department', { initialValue: 1 }]">
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
</template>

<script>
export default {
  name: 'user-add',
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
      path: {}
    }
  },
  async beforeCreate() {
    let { result } = await this.$axios.$get(this.$store.state.api.getPath)
    this.path = result
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.postAddUser(values)
        }
      })
    },
    async postAddUser(user) {
      try {
        let result = await this.$axios.$post(this.$store.state.api.postAddUser, { data: user })
        if (result && result.statusCode == 200) {
          this.$message.info('增加成功！');
          this.$router.push('/users')
        }
      } catch (e) {
        this.$message.info('增加出错！');
      }

    }
  }
}
</script>
