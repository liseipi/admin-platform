<template>
  <section>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回"
      @back="$router.back()"
    />
    <a-divider>增加显示器</a-divider>
    <a-form :form='form' @submit='handleSubmit'>
      <a-form-item v-bind='formItemLayout'>
        <span slot='label'>
          资产编号
        </span>
        <a-input
          v-decorator="[
            'snID',
            {
              rules: [{ required: true, message: '请填写资产编号', whitespace: true }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='关联用户'>
        <a-row :gutter='8'>
          <a-col :span='12'>
            <a-select
              show-search
              placeholder="Select a person"
              option-filter-prop="children"
              :filter-option="filterOption"
              v-decorator="['user_id']" :loading='status.loadingUser'
            >
              <a-select-option v-if='users.length>0' v-for='(item, index) in users' :key='index' :value="item.id">
                {{item.name}} - {{item.name_en}}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span='12'>
            <a-button @click='getUserAll'>获取用户列表</a-button>
          </a-col>
        </a-row>
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
      <a-form-item v-bind='formItemLayout' label='品牌'>
        <a-input v-decorator="['brand']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='型号'>
        <a-input v-decorator="['model']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='详细信息'>
        <a-input v-decorator="['details']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='显示状态'>
        <a-select v-decorator="['status', { initialValue: '0' }]" style="width: 220px">
          <a-select-option value="0">
            正常
          </a-select-option>
          <a-select-option value="1">
            损坏
          </a-select-option>
          <a-select-option value="2">
            闲置
          </a-select-option>
          <a-select-option value="3">
            维修中
          </a-select-option>
          <a-select-option value="4">
            变卖
          </a-select-option>
          <a-select-option value="5">
            报废
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind='tailFormItemLayout'>
        <a-button type='primary' html-type='submit'>
          保存显示器
        </a-button>
      </a-form-item>
    </a-form>
  </section>
</template>

<script>
const key = 'updatable'
export default {
  name: 'monitor-add',
  data() {
    return {
      path: {},
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
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      },
      status: {
        loadingUser: false,
        loadingMonitor: false
      },
      users: [],
      monitors: []
    }
  },
  async beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' })

    let { result } = await this.$axios.$get(this.$store.state.api.getPath)
    this.path = result
  },

  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.sendAdd(values)
        }
      })
    },
    async sendAdd(data) {
      this.$message.loading({ content: 'Save...', key })
      // console.log(data)
      let result = await this.$axios.$post(this.$store.state.api.monitorAdd, {
        data: data
      })
      if (result.statusCode === 200) {
        this.$message.success({ content: 'OK!', key, duration: 2 })
        this.$router.push('/assets/monitor')
      } else {
        this.$message.error({ content: result.message, key, duration: 2 })
      }
    },
    async getUserAll(){
      this.status.loadingUser = true
      let result = await this.$axios.$get(this.$store.state.api.getUserAll)
      this.status.loadingUser = false
      if (result.statusCode === 200) {
        this.users = result.result.data
      } else {
        this.$message.error('Fail!')
      }
    }
  }
}
</script>
