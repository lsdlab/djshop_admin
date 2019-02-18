import { stringify } from 'qs';
import request from '@/utils/request';
const axios = require('axios');


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


const apiHost = 'http://localhost:9000';    // development
// const apiHost = '';    // production
const apiVersion = '/api/v1';

function refreshToken(oldToken) {
  axios.post(`${apiHost}${apiVersion}/jwt/token-refresh/`, {
    token: oldToken,
  })
  .then(function (response) {
    console.log(response);
    return response.data.token
  })
}

function getToken() {
  var token = ''
  if (localStorage.getItem("token") !== null) {
    if (localStorage.getItem('now') + (1 * 24 * 60 * 60 * 1000) < new Date().getTime()) {
      // token 过期，需要刷新
      token = refreshToken(localStorage.getItem('token'))
    } else {
      // token 未过期
      token = localStorage.getItem("token")
    }
    return token
  }
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
  return request(`${apiHost}${apiVersion}/users/current_user/`, {
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
  return request(`${apiHost}${apiVersion}/articles/${aritcleID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

export async function fetchArticle(aritcleID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/articles/${aritcleID}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取开屏广告列表
export async function querySplash(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/splashs/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建开屏广告
export async function createSplash(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/splashs/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

//修改开屏广告
export async function patchSplash(params, splashID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/splashs/${splashID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 删除开屏广告
export async function deleteSplash(splashID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/splashs/${splashID}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 开屏广告状态改变
export async function convertSplash(params, splashID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/splashs/${splashID}/convert/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取轮播图列表
export async function queryBanner(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/banners/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建轮播图
export async function createBanner(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/banners/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改轮播图
export async function patchBanner(params, bannerID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/banners/${bannerID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 删除轮播图
export async function deleteBanner(bannerID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/banners/${bannerID}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取全网提醒列表
export async function queryNotice(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/notices/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建全网提醒
export async function createNotice(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/notices/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 删除全网提醒
export async function deleteNotice(noticesID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/notices/${noticesID}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 分类列表
export async function queryCategory() {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/category/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建分类
export async function createCategory(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/category/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改分类
export async function patchCategory(params, categoryID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/category/${categoryID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建商品
export async function createProduct(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建商品规格
export async function createProductSpec(params, productID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/${productID}/specs/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取商品列表
export async function queryProducts(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取单个商品详细信息
export async function fetchProduct(productID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/${productID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改商品信息
export async function patchProduct(params, productID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/${productID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取商品规格信息
export async function queryProductSpecs(params, productID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/${productID}/specs/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}


// 修改商品规格信息
export async function patchProductSpec(params, productSpecID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/${productSpecID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}


// 获取商品评价列表
export async function queryProductReviews(params, productID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/${productID}/reviews/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}
