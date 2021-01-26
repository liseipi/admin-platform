<template>
  <a-layout id="layout-side">
    <a-layout-sider id="layout-left-side" v-model="collapsed" width="256">
      <div class="logo">
        <span>
          <img src="~/static/logo.svg" width="32" alt="logo">
          <h1>Admin Platform</h1>
        </span>
      </div>
      <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
        <a-menu-item key="1" @click="$router.push('/')">
          <a-icon type="pie-chart"/>
          <span>Dashboard</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <span slot="title"><a-icon type="desktop"/><span>资产信息</span></span>
          <a-menu-item key="2" @click="$router.push('/assets')">
            <span>企业资产</span>
          </a-menu-item>
          <a-menu-item key="3" @click="$router.push('/assets/add')">
            增加资产
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="team"/><span>用户信息</span></span>
          <a-menu-item key="6" @click="$router.push('/users')">
            用户列表
          </a-menu-item>
          <a-menu-item key="7" @click="$router.push('/users/add')">
            增加用户
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <a-icon type="file"/>
          <span>File</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout id="layout-main">
      <a-layout-header id="layout-header">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <div style="padding: 0 24px;">
          <a-popover placement="bottomRight">
            <div slot="title" style="padding: 8px 0;">
              个人资料
            </div>
            <template slot="content">
              <p>
                <nuxt-link to="/">修改信息</nuxt-link>
              </p>
              <p>
                <a-button type="link" @click="signOut" style="padding: 0;">
                  退出帐户
                </a-button>
              </p>
            </template>
            <a-avatar size="large" icon="user"/>
          </a-popover>
        </div>
      </a-layout-header>
      <a-layout-content id="layout-content">
        <div id="page-content">
          <Nuxt/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  export default {
    data() {
      return {
        collapsed: false
      }
    },
    methods: {
      async signOut() {
        await this.$auth.logout('local')
        this.$cookies.removeAll()
        this.$router.replace('/login')
      }
    }
  }
</script>
