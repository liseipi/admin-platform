<template>
  <section>
    <a-table bordered :columns="assetsColumns" :data-source="assets" rowKey="id" :pagination="pagination">
      <template slot="name" slot-scope="text, n">
        {{n.user_info.name}} - {{n.user_info.name_en}}
      </template>
      <template slot="position" slot-scope="text, p">
        {{p.position}}/{{p.branch}}/{{p.attribution}} <br>
        {{p.ip_address}}
      </template>
      <template slot="status" slot-scope="s">{{ s == 0 ? '正常' : '损坏' }}</template>

      <template slot="action" slot-scope="text, a">
        <NLink :to="{path: `/assets/details?id=${a.id}`}">查看详细</NLink>
        <a href="javascript:;">修改</a>
      </template>
    </a-table>
  </section>
</template>
<script>
  export default {
    name: 'pc-assets',
    data() {
      return {
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
            title: '部门',
            key: 'department',
            dataIndex: 'department'
          },
          {
            title: '位置/IP地址',
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
        ]
      }
    },
    async created() {
      let { result } = await this.$axios.$get(this.$store.state.api.getAssets, {})
      this.assets = result.data
    },
    methods: {
      action() {

      }
    }
  }
</script>
