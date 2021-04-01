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
    <a-divider v-if='data'>资产详细</a-divider>
    <div style='max-width: 800px; margin: 0 auto;' v-if='data'>
      <a-list>
        <a-list-item>
          资产编号：{{ data.snID }}
        </a-list-item>
        <a-list-item>
          状态：{{ deviceStatus(data.status) }}
        </a-list-item>
        <a-list-item>
          公司：{{ data.attribution_name }}
        </a-list-item>
        <a-list-item>
          城市：{{ data.position_name }}
        </a-list-item>
        <a-list-item>
          办公室：{{ data.branch_name }}
        </a-list-item>
        <a-list-item>
          部门：{{ data.department_name }}
        </a-list-item>
        <a-list-item>
          IP地址：{{ data.ip_address }}
        </a-list-item>
        <a-list-item>
          物理地址：{{ data.mac_address }}
        </a-list-item>
        <a-list-item>
          内存：{{ data.ram }}
        </a-list-item>
        <a-list-item>
          CPU：{{ data.cpu_info }}
        </a-list-item>
        <a-list-item>
          显卡：{{ data.gpu_info }}
        </a-list-item>
        <a-list-item>
          主板：{{ data.motherboard_info }}
        </a-list-item>
        <a-list-item>
          硬盘：{{ data.disk }}
        </a-list-item>
        <a-divider>资产使用者</a-divider>
        <a-list-item>
          姓名：{{ data.user_info.name }}
        </a-list-item>
        <a-list-item>
          英文名：{{ data.user_info.name_en }}
        </a-list-item>
<!--        <a-divider>显示器</a-divider>-->
<!--        <a-table :columns='columns' :data-source='data.monitor_info' :pagination='false' rowKey='snID'>-->
<!--          <a slot='name' slot-scope='text'>{{ text }}</a>-->
<!--        </a-table>-->
        <a-divider>用户使用记录</a-divider>
        <a-table :columns='log_columns' :data-source='logs' :pagination='false' rowKey='snID'>
          <span slot='name' slot-scope='text'>{{ text.user_info.name }} {{text.user_info.name_en}}</span>
          <span slot='stime' slot-scope='text'>{{ new Date(parseInt(text.start_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ') }}</span>
          <span slot='etime' slot-scope='text'>{{ new Date(parseInt(text.end_time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ') }}</span>
        </a-table>
      </a-list>
    </div>
  </section>
</template>

<script>
import QRCode from 'qrcode'
import printJS from 'print-js'
const { createCanvas, loadImage } = require('canvas')

export default {
  name: 'desktop-details',
  data() {
    return {
      qrcode: null,
      qrcode_uri: '',
      canvasImg: '',
      data: null,
      logs: [],
      columns: [
        {
          title: '资产编号',
          key: 'snID',
          dataIndex: 'snID'
        },
        {
          title: '品牌',
          key: 'brand',
          dataIndex: 'brand'
        },
        {
          title: '型号',
          key: 'model',
          dataIndex: 'model'
        }
      ],
      log_columns: [
        {
          title: '姓名',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '开始使用时间',
          scopedSlots: { customRender: 'stime' }
        },
        {
          title: '结束使用时间',
          scopedSlots: { customRender: 'etime' }
        },
      ]
    }
  },
  async created() {
    let { id } = this.$route.query
    this.qrcode_uri = `${process.env.BASE_URL}/qrcode/desktop?id=${id}`

    let { result } = await this.$axios.$get(this.$store.state.api.getAssetsDetails, { params: { id } })
    this.data = result.data[0]

    let logs = await this.$axios.$get(this.$store.state.api.getDesktopLogs, { params: { id } })
    this.logs = logs.result
  },
  methods: {
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

      // ctx.font = '40px Impact'
      ctx.font = 'normal bold 46px Arial,sans-serif'
      ctx.fillText(`${this.data.attribution_name}`, 290, 120)

      await loadImage('../image/logo.jpg').then((image) => {
        ctx.drawImage(image, 450, 50, 300, 122)
      })

      ctx.font = 'normal bold 34px Arial,sans-serif'
      ctx.fillText(`部门：${this.data.department_name}`, 290, 200)

      ctx.font = 'normal bold 34px Arial,sans-serif'
      ctx.fillText(`资产编号：${this.data.snID}`, 290, 260)

      this.canvasImg = canvas.toDataURL()
    },
    print() {
      printJS(this.canvasImg, 'image')
    },
    deviceStatus(s) {
      let status = ''
      switch (parseInt(s)) {
        case 0:
          status = '正常'
          break;
        case 1:
          status = '损坏'
          break;
        case 2:
          status = '闲置'
          break;
        case 3:
          status = '维修中'
          break;
        case 4:
          status = '变卖'
          break;
        case 5:
          status = '报废'
          break;
        default:
          status = '-'
      }
      return status
    }
  },
  mounted() {
    this.generateQrcode()
  }
}
</script>
