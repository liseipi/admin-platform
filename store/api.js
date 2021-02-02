export const state = () => ({
  dashboard: '/api/dashboard',

  getAssets: '/api/assets/getAll',
  getAssetsDetails: '/api/assets/details/:id',
  assetsAdd: '/api/assets/add',
  assetsUpdate: '/api/assets/update/:id',

  getMonitor: '/api/monitor/getAll',
  monitorAdd: '/api/monitor/add',
  getMonitorDetails: '/api/monitor/details/:id',
  monitorUpdate: '/api/monitor/update/:id',

  getOther: '/api/other/getAll',
  otherAdd: '/api/other/add',
  getOtherDetails: '/api/other/details/:id',
  otherUpdate: '/api/other/update/:id',

  getUserAll: '/api/user/getAll',
  postAddUser: '/api/user/add',
  getDestroyUser: '/api/user/destroy/:id',

  getPath: '/api/getPath'
})
