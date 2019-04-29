module.exports = {
  apps : [{
    name: 'Fampedia Backend',
    script: 'src/app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances : "max",
    exec_mode : "cluster",
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production'
    },
  }],
  deploy: {}
};
