<template>
  <section>
    <a-page-header
      style='border: 1px solid rgb(235, 237, 240)'
      title='返回'
      @back='$router.back()'
    >
      <template slot="extra">
        <a-button key="2" v-show='!canvasImg' type='primary' @click='generateTag'>
          生成标签
        </a-button>
        <a-button key="1" v-show='canvasImg' icon='printer' @click='print'>
          打印标签
        </a-button>
      </template>
    </a-page-header>
    <div style='display:flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;'>
      <a :href='qrcode_uri' target='_blank'>
        <img :src='qrcode' style='width: 100px; margin-top: 5px; padding: 5px; border:1px solid #ddd; display: none;' />
      </a>
      <img :src='canvasImg' alt='tag' v-show='canvasImg'>
    </div>
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
      <a-form-item v-bind='formItemLayout' label='品牌'>
        <a-input v-decorator="['brand', { initialValue: details.brand }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='型号'>
        <a-input v-decorator="['model', { initialValue: details.model }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='详细信息'>
        <a-input v-decorator="['details', { initialValue: details.details }]" />
      </a-form-item>
      <a-form-item v-bind='formItemLayout' label='显示器状态'>
        <a-select v-decorator="['status', { initialValue: String(details.status) }]" style="width: 220px">
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
        </a-select>
      </a-form-item>
      <a-form-item v-bind='tailFormItemLayout'>
        <a-button type='primary' html-type='submit'>
          修改显示器信息
        </a-button>
      </a-form-item>
    </a-form>
  </section>
</template>

<script>
import QRCode from 'qrcode'
import printJS from 'print-js'
const { createCanvas, loadImage } = require('canvas')
const key = 'updatable'

export default {
  name: 'monitor-edit',
  data() {
    return {
      qrcode: null,
      qrcode_uri: '',
      canvasImg: '',
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
  async created() {
    let { id } = this.$route.query
    this.qrcode_uri = `${process.env.BASE_URL}/qrcode/monitor?id=${id}`

    this.form = this.$form.createForm(this, { name: 'register' })

    let { result } = await this.$axios.$get(this.$store.state.api.getPath)
    this.path = result

    let details = await this.$axios.$get(this.$store.state.api.getMonitorDetails, { params: { id } })
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
      // console.log(data)
      this.$message.loading({ content: 'Save...', key })
      // console.log(data)
      let result = await this.$axios.$post(this.$store.state.api.monitorUpdate, {
        data: data
      }, {
        params: {
          id
        }
      })
      if (result.statusCode === 200) {
        this.$message.success({ content: 'OK!', key, duration: 2 })
        this.$router.push('/assets/monitor')
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
    generateQrcode() {
      QRCode.toDataURL(this.qrcode_uri, {
        margin: 1,
        width: 500,
        height: 500
      }, (err, url) => {
        this.qrcode = url
      })
    },
    async generateTag() {
      const canvas = createCanvas(794, 340)
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 794, 340)
      ctx.fillStyle = '#000'

      let Point = function(x, y) {
        return { x: x, y: y }
      }

      function Rect(x, y, w, h) {
        return { x: x, y: y, width: w, height: h }
      }

      let rect = Rect(10, 10, 774, 320)

      drawRoundedRect(rect, 25, ctx)

      function drawRoundedRect(rect, r, ctx) {
        let ptA = Point(rect.x + r, rect.y)
        let ptB = Point(rect.x + rect.width, rect.y)
        let ptC = Point(rect.x + rect.width, rect.y + rect.height)
        let ptD = Point(rect.x, rect.y + rect.height)
        let ptE = Point(rect.x, rect.y)

        ctx.beginPath()

        ctx.moveTo(ptA.x, ptA.y)
        ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
        ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
        ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
        ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)

        ctx.stroke()
      }

      const img = new Image()
      img.src = this.qrcode
      ctx.drawImage(img, 40, 50, 227, 237)

      ctx.font = 'normal bold 46px Arial,sans-serif'
      ctx.fillText(`${this.details.attribution_name}`, 290, 120)

      await loadImage('../image/logo.jpg').then((image) => {
        ctx.drawImage(image, 450, 50, 300, 122)
      })

      ctx.font = 'normal bold 34px Arial,sans-serif'
      ctx.fillText(`部门：${this.details.department_name}`, 290, 200)

      ctx.font = 'normal bold 34px Arial,sans-serif'
      ctx.fillText(`资产编号：${this.details.snID}`, 290, 260)

      this.canvasImg = canvas.toDataURL()
    },
    print() {
      printJS(this.canvasImg, 'image')
    }
  },
  mounted() {
    this.generateQrcode()
  }
}
</script>
