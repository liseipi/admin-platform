module.exports = {
  apps: [
    {
      name: 'admin-platform',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      // autoRefresh: true,
      // watch: true,
      args: 'start'
    }
  ]
}
