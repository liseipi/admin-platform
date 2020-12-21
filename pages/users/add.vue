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
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
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
          this.$message.info('增加成功！')
        }
      } catch (e) {
        this.$message.info('增加出错！')
        console.log(e)
      }

    }
  }
}
</script>
