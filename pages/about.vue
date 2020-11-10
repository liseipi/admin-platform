<template>
  <section>
    <a-table bordered :columns="assetsColumns" :data-source="assets">

      <span slot="status" slot-scope="status">
        <a-tag
          v-for="t in status"
          :key="t"
        >
          {{ t }} -
        </a-tag>
      </span>

      <template v-slot:action>
        <a href="javascript:;">查看详细</a>
        <a href="javascript:;">修改</a>
      </template>
    </a-table>
    <a-table :columns="columns" :data-source="data">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="customTitle"><a-icon type="smile-o"/> Name</span>
      <span slot="tags" slot-scope="tags">
      <a-tag
        v-for="tag in tags"
        :key="tag"
        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
      <span slot="action" slot-scope="text, record">
      <a>Invite 一 {{ record.name }}</a>
      <a-divider type="vertical"/>
      <a>Delete</a>
      <a-divider type="vertical"/>
      <a class="ant-dropdown-link"> More actions <a-icon type="down"/> </a>
    </span>
    </a-table>
  </section>
</template>
<script>
  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      slots: { title: 'customTitle' },
      scopedSlots: { customRender: 'name' }
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      scopedSlots: { customRender: 'tags' }
    },
    {
      title: 'Action',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ]

  export default {
    data() {
      return {
        data,
        columns,
        assets: [],
        assetsColumns: [
          {
            title: '资产编号',
            dataIndex: 'snID'
          },
          {
            title: '用户',
            dataIndex: 'name'
          },
          {
            title: '部门',
            dataIndex: 'department'
          },
          {
            title: 'IP地址',
            dataIndex: 'ip_address'
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
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
      let result = await this.$axios.get(this.$store.state.api.getAssets)
      console.log(result)
      console.log(result.data)
      // this.assets = data.data.result.data
      /*
      *
      * cpu_info: "Intel(R) Core(TM) i3-7100 CPU @ 3.90GHz"
        createdAt: 0
        department: "销售平台"
        gpu_info: null
        id: 1
        ip_address: "192.168.1.154"
        mac_address: "18:31:BF:CB:A9:EE"
        motherboard_info: "ASUSTeK COMPUTER INC. H110M-A/M.2"
        name: "何梓倩"
        name_en: "Holly He"
        ram: "8.00GB"
        remarks: null
        snID: "JBL-PC0001"
        status: 0
        updatedAt: 0
      * */
    },
    methods: {
      action() {

      }
    }
  }
</script>
