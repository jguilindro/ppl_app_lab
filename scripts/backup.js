const { spawn } = require('child_process')

const deploySh = spawn('sh', [ 'mongoBackup.sh' ], {
  cwd: process.env.HOME + '/proyects/ppl/ppl_app_lab/scripts',
  env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
})

module.exports = deploySh