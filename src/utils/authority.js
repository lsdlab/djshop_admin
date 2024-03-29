// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // return authority || ['admin'];
  // JC localstorage 没有 antd-pro-authority 这个键就认为没有登录
  return authority;
}

export function setAuthority(authority, currentUser) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  if (proAuthority == 'admin') {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } else if (proAuthority == 'guest') {
    localStorage.setItem('currentUser', JSON.stringify({}));
  }
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
