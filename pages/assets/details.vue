<template>
  <section>
    <a-page-header
      style='border: 1px solid rgb(235, 237, 240)'
      title='返回'
      @back='$router.back()'
    />
    <div style='display:flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;'>
      <a :href='qrcode_uri' target='_blank'><img :src='qrcode' style='width: 100px; margin-top: 5px; padding: 5px; border:1px solid #ddd; display: none;' /></a>
      <img :src='canvasImg' alt='tag' v-show='canvasImg'>
      <a-button type="primary" icon="printer" @click='generateTag'>
        生成打印标签
      </a-button>
    </div>
    <a-divider v-if='data'>资产详细</a-divider>
    <div style='max-width: 800px; margin: 0 auto;' v-if='data'>
      <a-list>
        <a-list-item>
          资产编号：{{ data.snID }}
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
          硬盘：{{ data.disk }}
        </a-list-item>
        <a-divider>资产使用者</a-divider>
        <a-list-item>
          姓名：{{ data.user_info.name }}
        </a-list-item>
        <a-list-item>
          英文名：{{ data.user_info.name_en }}
        </a-list-item>
        <a-divider>显示器</a-divider>
        <a-table :columns='columns' :data-source='data.monitor_info' :pagination='false' rowKey='snID'>
          <a slot='name' slot-scope='text'>{{ text }}</a>
        </a-table>
      </a-list>
    </div>
  </section>
</template>

<script>
import QRCode from 'qrcode'
const { registerFont, createCanvas, loadImage } = require('canvas')

export default {
  name: 'desktop-details',
  data() {
    return {
      qrcode: null,
      qrcode_uri: '',
      canvasImg: '',
      data: null,
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
      ]
    }
  },
  async created() {
    let { id } = this.$route.query
    this.qrcode_uri = `${process.env.BASE_URL}/qrcode/desktop?id=${id}`

    let { result } = await this.$axios.$get(this.$store.state.api.getAssetsDetails, { params: { id } })
    this.data = result.data[0]
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
    async generateTag(){
      const canvas = createCanvas(640, 270)
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = "#fff"
      ctx.fillRect(0,0, 640, 270)
      ctx.fillStyle = "#000"

      let Point = function(x, y) {
        return {x:x, y:y};
      };

      function Rect(x, y, w, h) {
        return {x:x, y:y, width:w, height:h};
      }

      let rect = Rect(5, 5, 630, 260);

      drawRoundedRect(rect, 25, ctx);

      function drawRoundedRect(rect, r, ctx) {
        let ptA = Point(rect.x + r, rect.y);
        let ptB = Point(rect.x + rect.width, rect.y);
        let ptC = Point(rect.x + rect.width, rect.y + rect.height);
        let ptD = Point(rect.x, rect.y + rect.height);
        let ptE = Point(rect.x, rect.y);

        ctx.beginPath();

        ctx.moveTo(ptA.x, ptA.y);
        ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
        ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
        ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
        ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

        ctx.stroke();
      }

      const img = new Image()
      img.src = this.qrcode
      ctx.drawImage(img, 45, 45, 170, 170)

      ctx.font = '38px Impact'
      ctx.fillText('杰钡利', 250, 100)

      await loadImage('../image/logo.jpg').then((image) => {
        ctx.drawImage(image, 400, 45, 200, 82)
      })

      ctx.font = '24px "Comic Sans"'
      ctx.fillText(`资产编号：${this.data.snID}`, 250, 180)

      this.canvasImg = canvas.toDataURL();
    }
  },
  mounted() {
    this.generateQrcode()
  }
}
</script>
