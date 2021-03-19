<template>
  <section>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回"
      @back="$router.back()"
    />
    <a-divider>增加资产</a-divider>
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
      <a-form-item v-bind='formItemLayout' label='IP地址'>
        <a-input v-decorator="['ip_address']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='MAC地址'>
        <a-input v-decorator="['mac_address']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='内存'>
        <a-input v-decorator="['ram']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='CPU信息'>
        <a-input v-decorator="['cpu_info']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='显卡信息'>
        <a-input v-decorator="['gpu_info']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='主板信息'>
        <a-input v-decorator="['motherboard_info']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='硬盘信息'>
        <a-input v-decorator="['disk']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='其它备注'>
        <a-input v-decorator="['remarks']" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='主机状态'>
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
<!--        <a-switch default-checked checked-children='正常' un-checked-children='损坏'-->
<!--                  v-decorator="['status', { initialValue: true, valuePropName: '1' }]" />-->

      </a-form-item>
<!--      <a-form-item v-bind='formItemLayout' label='关联显示器' extra="温馨提示：添加一个或多个显示器需将原来绑定显示器删除后才可添加">-->
<!--        <a-row :gutter='24'>-->
<!--          <a-col :span='16'>-->
<!--            <a-select-->
<!--              mode="multiple"-->
<!--              show-search-->
<!--              placeholder="Select a person"-->
<!--              option-filter-prop="children"-->
<!--              :filter-option="filterOption"-->
<!--              v-decorator="['monitor_id']" :loading='status.loadingMonitor'-->
<!--            >-->
<!--              <a-select-option v-for='(item, index) in monitors' :key='index' :value="item.id">-->
<!--                {{item.snID}} - {{item.brand}}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--          </a-col>-->
<!--          <a-col :span='8'>-->
<!--            <a-button @click='getMonitorAll'>获取显示器</a-button>-->
<!--          </a-col>-->
<!--        </a-row>-->
<!--      </a-form-item>-->
      <a-form-item v-bind='tailFormItemLayout'>
        <a-button type='primary' html-type='submit'>
          创建新的主机
        </a-button>
      </a-form-item>
    </a-form>
  </section>
</template>

<script>
const key = 'updatable'
export default {
  name: 'assets-add',
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
      let result = await this.$axios.$post(this.$store.state.api.assetsAdd, {
        data: data
      })
      // console.log(result)
      if (result.statusCode === 200) {
        this.$message.success({ content: 'OK!', key, duration: 2 })
        this.$router.push('/assets')
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
    },
    async getMonitorAll(){
      this.status.loadingMonitor= true
      let result = await this.$axios.$get(this.$store.state.api.getMonitorNull, {

      })
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
