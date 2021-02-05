<template>
  <section>
    <a-form :form='form' layout='inline' @submit='handleSubmit'>
      <a-form-item label='条件'>
        <a-select
          style='width: 10em;'
          v-decorator="['select', { rules: [{ required: true, message: 'Please select your select!' }], initialValue: 'snID' }]"
          placeholder='选择查找的字段'
        >
          <a-select-option value='snID'>
            资产编号
          </a-select-option>
          <a-select-option value='sn_name'>
            名称
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
        <NLink type='primary' :to="{path: '/assets/other_add'}">
          <a-button icon='file-add'>增加其它资产</a-button>
        </NLink>
      </a-form-item>
    </a-form>
    <a-divider />
    <a-table bordered :columns='assetsColumns' :data-source='assets' rowKey='id' :pagination='pagination'>
      <template slot='name' slot-scope='text, n'>
        {{ n.user_info.name }} - {{ n.user_info.name_en }}
      </template>
      <template slot='info' slot-scope='text, i'>
        {{ i.sn_name }} / ({{ i.model }})
      </template>
      <template slot='position' slot-scope='text, p'>
        {{ p.position_name }}/{{ p.branch_name }}/{{ p.attribution_name }} <br>
        {{ p.department_name }}
      </template>
      <template slot='status' slot-scope='s'>{{ s == 0 ? '正常' : '损坏' }}</template>

      <template slot='action' slot-scope='text, a'>
<!--        <NLink :to='{path: `/assets/details?id=${a.id}`}'>-->
<!--          <a-button type='primary'>-->
<!--            查看详细-->
<!--          </a-button>-->
<!--        </NLink>-->
        <NLink :to='{path: `/assets/other_edit?id=${a.id}`}'>
          <a-button type='primary'>查看/修改</a-button>
        </NLink>
      </template>
    </a-table>
  </section>
</template>
<script>
export default {
  name: 'monitor-assets',
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
          title: '名称/型号',
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
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  async created() {
    let { result } = await this.$axios.$get(this.$store.state.api.getOther, {})
    this.assets = result.data
  },
  methods: {
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
      let result = await this.$axios.$get(this.$store.state.api.getOther, {
        params: select
      })
      // console.log(result)
      this.assets = result.result.data
    }
  }
}
</script>
