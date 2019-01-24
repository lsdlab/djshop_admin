import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}


const apiHost = 'http://localhost:8000';    // development
// const apiHost = 'http://localhost:8000';    // production
const apiVersion = '/api/v1';

function getToken() {
  if (localStorage.getItem("token") !== null) {
    return localStorage.getItem("token")
  }
  return ''
}

export async function jwtToken(params) {
  return request(`${apiHost}${apiVersion}/jwt/token-auth/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function fetchCurrent() {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/users/fetch_current/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

export async function queryArticles(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/articles/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

export async function createArticle(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/articles/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

export async function patchArticle(params, aritcleID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/articles/${aritcleID}`, {
    method: 'patch',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

export async function deleteArticle(aritcleID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/articles/${aritcleID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}
