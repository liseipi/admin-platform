<template>
  <section>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="返回"
      @back="$router.back()"
    />
    <a-divider v-if="data">资产详细</a-divider>
    <div v-if="data">
      <a-list>
        <a-list-item>
          资产编号：{{data.snID}}
        </a-list-item>
        <a-list-item>
          姓名：{{data.user_info.name}}
        </a-list-item>
        <a-list-item>
          英文名：{{data.user_info.name_en}}
        </a-list-item>
        <a-list-item>
          公司：{{data.attribution}}
        </a-list-item>
        <a-list-item>
          城市：{{data.position}}
        </a-list-item>
        <a-list-item>
          办公室：{{data.branch}}
        </a-list-item>
        <a-list-item>
          部门：{{data.department}}
        </a-list-item>
        <a-list-item>
          IP地址：{{data.ip_address}}
        </a-list-item>
        <a-list-item>
          物理地址：{{data.mac_address}}
        </a-list-item>
        <a-list-item>
          内存：{{data.ram}}
        </a-list-item>
        <a-list-item>
          CPU：{{data.cpu_info}}
        </a-list-item>
        <a-list-item>
          硬盘：{{data.disk}}
        </a-list-item>
        <a-divider>显示器</a-divider>
        <a-table :columns="columns" :data-source="data.monitor_info" :pagination="false">
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
      </a-list>
    </div>
<!--    <pre>{{data}}</pre>-->
  </section>
</template>

<script>
  export default {
    name: 'details',
    data() {
      return {
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
          },
        ]
      }
    },
    async created() {
      let { id } = this.$route.query

      let { result } = await this.$axios.$get(this.$store.state.api.getAssetsDetails, {
        params: {
          id
        }
      })
      this.data = result.data[0]
    }
  }
</script>
