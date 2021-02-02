<template>
  <section>
    <a-page-header
      style='border: 1px solid rgb(235, 237, 240)'
      title='返回'
      @back='$router.back()'
    />
    <a-divider>资产修改</a-divider>
    <a-form :form='form' @submit='handleSubmit'>
      <a-form-item v-bind='formItemLayout'>
        <span slot='label'>
          资产编号
        </span>
        <a-input
          v-decorator="[
            'snID',
            {
              initialValue: details.snID,
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
              placeholder='Select a person'
              option-filter-prop='children'
              :filter-option='filterOption'
              v-decorator="['user_id', {initialValue: details.user_id}]" :loading='status.loadingUser'
            >
              <a-select-option v-if='users.length>0' v-for='(item, index) in users' :key='index' :value='item.id'>
                {{ item.name }} - {{ item.name_en }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span='12'>
            <a-button @click='getUserAll'>获取用户列表</a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='城域'>
        <a-select v-decorator="['position', { initialValue: details.position }]">
          <a-select-option v-for='(item, index) in path.position' :key='index' :value='item.id'>
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='公司'>
        <a-select v-decorator="['attribution', { initialValue: details.attribution }]">
          <a-select-option v-for='(item, index) in path.attribution' :key='index' :value='item.id'>
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='办公室'>
        <a-select v-decorator="['branch', { initialValue: details.branch }]">
          <a-select-option v-for='(item, index) in path.branch' :key='index' :value='item.id'>
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='部门'>
        <a-select v-decorator="['department', { initialValue: details.department }]">
          <a-select-option v-for='(item, index) in path.department' :key='index' :value='item.id'>
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='IP地址'>
        <a-input v-decorator="['ip_address', { initialValue: details.ip_address }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='MAC地址'>
        <a-input v-decorator="['mac_address', { initialValue: details.mac_address }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='内存'>
        <a-input v-decorator="['ram', { initialValue: details.ram }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='CPU信息'>
        <a-input v-decorator="['cpu_info', { initialValue: details.cpu_info }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='显卡信息'>
        <a-input v-decorator="['gpu_info', { initialValue: details.gpu_info }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='主板信息'>
        <a-input v-decorator="['motherboard_info', { initialValue: details.motherboard_info }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='硬盘信息'>
        <a-input v-decorator="['disk', { initialValue: details.disk }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='其它备注'>
        <a-input v-decorator="['remarks', { initialValue: details.remarks }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='主机状态'>
        <a-switch checked-children='正常' un-checked-children='损坏'
                  v-decorator="['status', { initialValue: (details.status === 0), valuePropName: 'checked' }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='关联显示器'>
        <a-row :gutter='24'>
          <a-col :span='16'>
            <a-select
              mode='multiple'
              show-search
              placeholder='Select a person'
              option-filter-prop='children'
              :filter-option='filterOption'
              v-decorator="['monitor_id', {initialValue: details.monitor_info && details.monitor_info.length>0?details.monitor_info.map(item => item.id):[]}]"
              :loading='status.loadingMonitor'
            >
              <a-select-option v-for='(item, index) in monitors' :key='index'
                               :value='item.id'>
                {{ item.snID }} - {{ item.brand }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span='8'>
            <a-button @click='getMonitorAll'>获取显示器</a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-bind='tailFormItemLayout'>
        <a-button type='primary' html-type='submit'>
          修改主机
        </a-button>
      </a-form-item>
    </a-form>
  </section>
</template>

<script>
const key = 'updatable'
export default {
  name: 'assets-edit',
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
      monitors: [],
      details: {}
    }
  },
  async beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' })

    let { result } = await this.$axios.$get(this.$store.state.api.getPath)
    this.path = result

    let { id } = this.$route.query
    let details = await this.$axios.$get(this.$store.state.api.getAssetsDetails, { params: { id } })
    this.details = details.result.data[0]
    this.users.push({
      id: this.details.user_id,
      name: this.details.user_info.name,
      name_en: this.details.user_info.name_en
    })
    if (this.details.monitor_info && this.details.monitor_info.length > 0) {
      this.details.monitor_info.forEach(item => {
        this.monitors.push({
          brand: item.brand,
          id: item.id,
          model: item.model,
          snID: item.snID
        })
      })
    }
  },

  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.sendUpdate(values)
        }
      })
    },
    async sendUpdate(data) {
      let { id } = this.$route.query
      console.log(data)
      this.$message.loading({ content: 'Save...', key })
      console.log(data)
      let result = await this.$axios.$post(this.$store.state.api.assetsUpdate, {
        data: data
      }, {
        params: {
          id
        }
      })
      if (result.statusCode === 200) {
        this.$message.success({ content: 'OK!', key, duration: 2 })
        this.$router.push('/assets')
      } else {
        this.$message.error({ content: 'Fail!', key, duration: 2 })
      }
    },
    async getUserAll() {
      this.status.loadingUser = true
      let result = await this.$axios.$get(this.$store.state.api.getUserAll)
      this.status.loadingUser = false
      if (result.statusCode === 200) {
        this.users = result.result.data
      } else {
        this.$message.error('Fail!')
      }
    },
    async getMonitorAll() {
      this.status.loadingMonitor = true
      let result = await this.$axios.$get(this.$store.state.api.getMonitor)
      this.status.loadingMonitor = false
      if (result.statusCode === 200) {
        this.monitors = result.result.data
      } else {
        this.$message.error('Fail!')
      }
    }
  }
}
</script>
