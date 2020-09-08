<template>
  <a-layout id="layout-side">
    <a-layout-sider id="layout-left-side" v-model="collapsed" width="256">
      <div class="logo"/>
      <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
        <a-menu-item key="1" @click="$router.push('/')">
          <a-icon type="pie-chart"/>
          <span>Option 1</span>
        </a-menu-item>
        <a-menu-item key="2" @click="$router.push('/about')">
          <a-icon type="desktop"/>
          <span>Option 2</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <span slot="title"><a-icon type="user"/><span>User</span></span>
          <a-menu-item key="3">
            Tom
          </a-menu-item>
          <a-menu-item key="4">
            Bill
          </a-menu-item>
          <a-menu-item key="5">
            Alex
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="team"/><span>Team</span></span>
          <a-menu-item key="6">
            Team 1
          </a-menu-item>
          <a-menu-item key="8">
            Team 2
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
              <p @click="signOut">
                退出帐户
              </p>
            </template>
            <a-avatar size="large" icon="user"/>
          </a-popover>
        </div>
      </a-layout-header>
      <a-layout-content id="layout-content">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
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
