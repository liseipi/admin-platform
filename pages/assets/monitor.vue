<template>
  <section>
    <a-form :form='form' layout='inline' @submit='handleSubmit'>
      <a-form-item label='条件'>
        <a-select
          style='width: 10em;'
          v-decorator="['select', { rules: [{ required: true, message: 'Please select your select!' }], initialValue: 'snID' }]"
        >
          <a-select-option value='snID'>
            资产编号
          </a-select-option>
          <a-select-option value='brand'>
            品牌
          </a-select-option>
          <a-select-option value='model'>
            型号
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='状态'>
        <a-select style='width: 10em;' v-decorator="['status',{ rules: [], initialValue: '-1' }]">
          <a-select-option value='-1'>
            全部
          </a-select-option>
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
          <a-select-option value='5'>
            报废
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='关键字'>
        <a-input
          v-decorator="['keyword']"
        />
      </a-form-item>
      <a-form-item>
        <a-button type='primary' html-type='submit'>
          查找
        </a-button>
      </a-form-item>
      <a-form-item style='float: right;'>
        <NLink type='primary' :to="{path: '/assets/monitor_add'}">
          <a-button icon='file-add'>增加显示器</a-button>
        </NLink>
      </a-form-item>
    </a-form>
    <a-divider />
    <a-table bordered :columns='assetsColumns' :data-source='assets' rowKey='id' :pagination='pagination'
             :scroll="{ x: '100%' }" :row-selection='{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }' @change='changePage'>
      <template slot='name' slot-scope='text, n'>
        {{ n.user_info.name }} - {{ n.user_info.name_en }}
      </template>
      <template slot='info' slot-scope='text, i'>
        {{ i.brand }}-({{ i.model }})
      </template>
      <template slot='position' slot-scope='text, p'>
        {{ p.position_name }}/{{ p.branch_name }}/{{ p.attribution_name }} <br>
        {{ p.department_name }}
      </template>
      <template slot='status' slot-scope='s'>{{ deviceStatus(s) }}</template>

      <template slot='action' slot-scope='text, a'>
        <NLink :to='{path: `/assets/monitor_edit?id=${a.id}`}'>
          <a-button type='primary'>查看/修改</a-button>
        </NLink>
      </template>
    </a-table>
    <div v-show='selectedRowKeys.length>0' style='text-align:center;'>
      <a-button type='primary' @click='generatePDF' :loading='genLoading'>
        导出选中项到PDF文件
      </a-button>
    </div>
  </section>
</template>
<script>
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'
import yaheibold from '@/plugins/yaheibold-bold'

export default {
  name: 'monitor-assets',
  data() {
    return {
      currentPage: 1,
      pagination: {
        defaultPageSize: 20
      },
      assets: [],
      assetsColumns: [
        {
          title: '资产编号',
          key: 'snID',
          dataIndex: 'snID'
        },
        {
          title: '用户',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '品牌/型号',
          scopedSlots: { customRender: 'info' }
        },
        {
          title: '位置/部门',
          scopedSlots: { customRender: 'position' }
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      genLoading: false,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  async created() {
    this.$message.loading({
      content: 'Loading..',
      duration: 0
    })
    let { result } = await this.$axios.$get(this.$store.state.api.getMonitor, {})
    this.assets = result.data
    this.$message.destroy()
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      // console.log('selectedRows changed: ', selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    changePage(page) {
      this.currentPage = page.current
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
          this.searchUser(values)
        }
      })
    },
    async searchUser(select) {
      // console.log(select)
      let result = await this.$axios.$get(this.$store.state.api.getMonitor, {
        params: select
      })
      // console.log(result)
      this.assets = result.result.data
    },
    async generateQrcode(id) {
      let qrcode_uri = `${process.env.BASE_URL}/qrcode/monitor?id=${id}`
      return new Promise((resolve, reject) => {
        QRCode.toDataURL(qrcode_uri, {
          margin: 1,
          width: 500,
          height: 500
        }, (err, url) => {
          resolve(url)
        })
      })
    },
    async generatePDF() {
      this.genLoading = true
      setTimeout(async () => {
        const doc = new jsPDF({
          orientation: 'l',
          unit: 'px',
          format: [794, 340]
        })

        let generateContent = async (item) => {
          // 画线圈
          // doc.setLineWidth(1.5)
          // doc.setLineDash([4, 4, 12, 3, 2, 2, 12, 3, 4, 3, 12, 4])
          // doc.setDrawColor(0)
          // doc.setFillColor(255, 255, 255)
          // doc.roundedRect(10, 10, 774, 320, 3, 3, 'FD')

          let qrcode = await this.generateQrcode(item.id)
          doc.addImage(qrcode, 'JPEG', 25, 45, 240, 240)

          doc.setFont('yaheibold', '', 'bold')
          doc.setFontSize(60)
          doc.text(item.attribution_name, 300, 100)

          doc.addImage('/image/logo-gray.jpg', 'JPEG', 455, 50, 300, 122)

          doc.setFontSize(45)
          doc.text(`部门：${item.department_name}`, 300, 200)

          doc.text(`资产编号：${item.snID}`, 300, 260)
        }
        await generateContent(this.selectedRows[0])

        if (this.selectedRows.length > 1) {
          for (let i = 1; i < this.selectedRows.length; i++) {
            doc.addPage([794, 340], 'l')
            await generateContent(this.selectedRows[i])
          }
        }

        doc.save(`monitor_page_${this.currentPage}.pdf`)
        this.genLoading = false
      }, 800)
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
  }
}
</script>
