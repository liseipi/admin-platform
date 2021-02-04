<template>
  <div class='container'>
    <a-breadcrumb style='margin: 16px 0'>
      <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
    </a-breadcrumb>

    <a-divider />
    <a-row>
      <a-col :span="8">
        <a-card title="主机资产">
          <h3>总数：{{desktop.total}}</h3>
          <h4>正常：{{desktop.status0}}</h4>
          <h4>损坏：{{desktop.status1}}</h4>
          <h4>闲置：{{desktop.status2}}</h4>
          <h4>维修中：{{desktop.status3}}</h4>
          <h4>变卖：{{desktop.status4}}</h4>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="显示器" style='flex-grow:1;'>
          <h3>总数：{{monitor.total}}</h3>
          <h4>正常：{{monitor.status0}}</h4>
          <h4>损坏：{{monitor.status1}}</h4>
          <h4>闲置：{{monitor.status2}}</h4>
          <h4>维修中：{{monitor.status3}}</h4>
          <h4>变卖：{{monitor.status4}}</h4>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="其它资产" style='flex-grow:1;'>
          <h3>总数：{{other.total}}</h3>
          <h4>正常：{{other.status0}}</h4>
          <h4>损坏：{{other.status1}}</h4>
          <h4>闲置：{{other.status2}}</h4>
          <h4>维修中：{{other.status3}}</h4>
          <h4>变卖：{{other.status4}}</h4>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      desktop: {},
      monitor: {},
      other: {}
    }
  },
  async beforeCreate() {
    let { result } = await this.$axios.$get(this.$store.state.api.dashboard)
    this.desktop = result.desktop[0]
    this.monitor = result.monitor[0]
    this.other = result.other[0]
  }
}
</script>
