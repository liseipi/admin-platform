<template>
  <section>
    <a-form :form='form' layout='inline' @submit='handleSubmit'>
      <a-form-item label='条件'>
        <a-select
          v-decorator="[
          'select',
          { rules: [{ required: true, message: 'Please select your select!' }], initialValue: 'name' },
        ]"
          placeholder='选择查找的字段'
        >
          <a-select-option value='name'>
            中文名
          </a-select-option>
          <a-select-option value='name_en'>
            英文名
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='名字'>
        <a-input
          v-decorator="['keyword', { rules: [{ required: true, message: '请输入搜索内容' }] }]"
        />
      </a-form-item>
      <a-form-item>
        <a-button type='primary' html-type='submit'>
          查找
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <a-table bordered :columns='usersColumns' :data-source='users' rowKey='id' :pagination='pagination'>
      <template slot='action' slot-scope='text, a'>
        <NLink :to='{path: `/users/assets?id=${a.id}`}'>
          <a-button type='primary'>查看资产</a-button>
        </NLink>
        |
        <a-button type='danger' @click='confirmDestroy(a.id)'>
          删除用户
        </a-button>
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
      ],
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  async created() {
    let { result } = await this.$axios.$get(this.$store.state.api.getUserAll, {})
    this.users = result.data
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
      let result = await this.$axios.$get(this.$store.state.api.getUserAll, {
        params: select
      })
      this.users = result.result.data
    },
    confirmDestroy(id) {
      let _this = this
      this.$confirm({
        title: '删除用户',
        content: '确认删除当前用户?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          _this.destroyUser(id)
          console.log('OK')
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    async destroyUser(id) {
      try {
        let result = await this.$axios.$get(this.$store.state.api.getDestroyUser, {
          params: {
            id
          }
        })
        if (result && result.statusCode == 200) {
          this.$message.info('删除成功！')
          let index = this.users.findIndex(item => item.id == id)
          this.users.splice(index, 1)
        }
      } catch (e) {
        this.$message.info('删除出错！')
        console.log(e)
      }
    }
  },
  mounted() {

  }
}
</script>
