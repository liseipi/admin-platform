export const state = () => ({
  dashboard: '/api/dashboard',

  getAssets: '/api/assets/getAll',
  getAssetsDetails: '/api/assets/details/:id',
  assetsAdd: '/api/assets/add',
  assetsUpdate: '/api/assets/update/:id',

  getMonitor: '/api/monitor/getAll',
  getMonitorNull: '/api/monitor/getAllNull',
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
  getUserAssets: '/api/user/assets/:id',

  getQrcodeDesktop: '/api/qrcode/desktop/:id',
  getQrcodeMonitor: '/api/qrcode/monitor/:id',
  getQrcodeOther: '/api/qrcode/other/:id',

  getPath: '/api/getPath'
})
