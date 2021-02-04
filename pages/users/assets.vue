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
          姓名：{{data.name}}
        </a-list-item>
        <a-list-item>
          英文名：{{data.name_en}}
        </a-list-item>
        <a-list-item>
          公司：{{data.attribution_name}}
        </a-list-item>
        <a-list-item>
          城市：{{data.position_name}}
        </a-list-item>
        <a-list-item>
          办公室：{{data.branch_name}}
        </a-list-item>
        <a-list-item>
          部门：{{data.department_name}}
        </a-list-item>

        <a-divider>主机</a-divider>
        <a-table :columns="desktopColumns" :data-source="data.desktop_info" :pagination="false" rowKey='snID'>
          <template slot="assetsInfo" slot-scope="text">
            IP地址：{{text.ip_address}} <br>
            物理地址：{{text.mac_address}}<br>
            内存：{{text.ram}}<br>
            CPU：{{text.cpu_info}}<br>
            硬盘：{{text.disk}}
          </template>
        </a-table>
        <a-divider>显示器</a-divider>
        <a-table :columns="columns" :data-source="data.monitor_info" :pagination="false" rowKey='snID'></a-table>
        <a-divider>其它资产</a-divider>
        <a-table :columns="otherColumns" :data-source="data.other_info" :pagination="false" rowKey='snID'>
        </a-table>
      </a-list>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'user-assets',
    data() {
      return {
        data: null,
        desktopColumns: [
          {
            title: '资产编号',
            key: 'snID',
            dataIndex: 'snID'
          },
          {
            title: '详细',
            key: 'info',
            scopedSlots: { customRender: 'assetsInfo' }
          },
        ],
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
        otherColumns: [
          {
            title: '资产编号',
            key: 'snID',
            dataIndex: 'snID'
          },
          {
            title: '名称',
            key: 'sn_name',
            dataIndex: 'sn_name'
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

      let { result } = await this.$axios.$get(this.$store.state.api.getUserAssets, {
        params: {
          id
        }
      })
      this.data = result.res[0]
    }
  }
</script>
