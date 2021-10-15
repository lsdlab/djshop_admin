var apiHost;
if (process.env.APP_TYPE === 'site' || process.env.NODE_ENV !== 'production') {
  console.log('========== DEVELOPMENT RUNSERVER ==========');
  apiHost = 'http://localhost:8000';
} else {
  console.log('======== PRODUCTION BUILD ========');
  apiHost = 'http://1.15.14.27:8001';
}

module.exports = {
  navTheme: 'light',
  primaryColor: '#1890FF',
  layout: 'topmenu',
  contentWidth: 'Fixed',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: false,
  menu: {
    disableLocal: false,
  },
  title: '严选电商',
  pwa: true,
  iconfontUrl: '',
  collapse: true,
  merchantID: '1',
  apiHost: apiHost,
  access_key_id: 'TFRBSWNQcm41WjZDWFl4Qw==',
  access_key_secret: 'Wkp4WjJ5RUJnRHNhNEJjcHVMRWxwVG9HejlhS1FV',
  region: 'oss-cn-shanghai',
  OSS_BUCKET: 'ZGpzaG9wbWVkaWE=',
  OSS_ENDPOINT: 'aHR0cHM6Ly9vc3MtY24tc2hhbmdoYWkuYWxpeXVuY3MuY29t',
};
