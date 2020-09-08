<template>
  <a-form
    id="components-form-demo-normal-login"
    :form="form"
    class="login-form"
    @submit="handleSubmit"
    style="max-width: 500px; width: 100%; margin: 0 auto; padding: 20px;"
  >
    <div class="space-align-container" style="padding: 40px 0 20px;">
      <div class="space-align-block" align="center">
        <a-avatar style="backgroundColor:#87d068" :size="75" icon="user"/>
      </div>
    </div>

    <a-form-item>
      <a-input
        v-decorator="[
          'email',
          { rules: [{ required: true, type: 'email', message: 'Please input your email!' }] },
        ]"
        size="large"
        placeholder="Email"
      >
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]"
        size="large"
        type="password"
        placeholder="Password"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" size="large" block class="login-form-button">
        Log in
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  export default {
    name: 'login',
    layout: 'block',
    auth: false,
    data() {
      return {
        form: this.$form.createForm(this)
      }
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields(async (err, values) => {
          if (!err) {
            try {
              let response = await this.$auth.loginWith('local', { data: values })
              // console.log(response)
              if (response.data && response.data.result) {
                this.$router.push('/')
              }
            } catch (err) {
              console.log(err)
            }
          }
        })
      }
    }
  }
</script>
