<template>
  <section>
    <div style='max-width: 400px; padding: 20px; margin: 0 auto;' v-if='Object.keys(data).length > 0'>
      <br>
      <a-divider>显示器资产信息</a-divider>
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
          品牌：{{ data.brand }}
        </a-list-item>
        <a-list-item>
          型号：{{ data.model }}
        </a-list-item>
        <a-list-item>
          详细信息：{{ data.details }}
        </a-list-item>

        <br>
        <a-divider>使用人</a-divider>
        <a-list-item>
          姓名：{{ data.user_info.name }}
        </a-list-item>
        <a-list-item>
          英文名：{{ data.user_info.name_en }}
        </a-list-item>
      </a-list>
    </div>
  </section>
</template>

<script>
export default {
  name: 'qrcode-monitor',
  auth: false,
  layout: 'block',
  head: {
    title: '资产信息'
  },
  data() {
    return {
      data: {}
    }
  },
  async created() {
    let { id } = this.$route.query

    let { result } = await this.$axios.$get(this.$store.state.api.getQrcodeMonitor, { params: { id } })
    this.data = result.data[0]
  }
}
</script>
