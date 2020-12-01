<template>
  <section>
    <a-table bordered :columns="usersColumns" :data-source="users" rowKey="id" :pagination="pagination">
      <template slot="action" slot-scope="text, a">
        <NLink :to="{path: `/assets/details?id=${a.id}`}">查看主机</NLink> |
        <NLink :to="{path: `/assets/details?id=${a.id}`}">查看显示器</NLink> |
        <a href="javascript:;">删除用户</a>
      </template>
    </a-table>
  </section>
</template>
<script>
  export default {
    name: 'users-index',
    data() {
      return {
        pagination: {
          defaultPageSize: 20
        },
        users: [],
        usersColumns: [
          {
            title: '用户ID',
            key: 'userID',
            dataIndex: 'id'
          },
          {
            title: '用户名',
            key: 'name',
            dataIndex: 'name'
          },
          {
            title: '英文名',
            key: 'nameEn',
            dataIndex: 'name_en'
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
      let { result } = await this.$axios.$get(this.$store.state.api.getUserAll, {})
      this.users = result.data
    },
    mounted() {
      console.log(this.users)
    }
  }
</script>
