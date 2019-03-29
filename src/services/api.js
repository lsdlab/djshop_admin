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
// const apiHost = 'https://shopapi.nuclearst.com';    // production
const apiVersion = '/api/v1';

function refreshToken(oldToken) {
  axios.post(`${apiHost}${apiVersion}/jwt/token-refresh/`, {
    token: oldToken,
  })
  .then(function (response) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('now', new Date().getTime());
    return response.data.token;
  })
}

function getToken() {
  var token = ''
  if (localStorage.getItem("token") !== null) {
    if (localStorage.getItem('now') + (1 * 24 * 60 * 60 * 1000) < new Date().getTime()) {
      // token 过期，需要刷新
      token = refreshToken(localStorage.getItem('token'));
    } else {
      // token 未过期
      token = localStorage.getItem("token");
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

// 修改商品规格
export async function patchProductSpec(params, productSpecID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/specs/${productSpecID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取单个商品规格详情
export async function fetchProductSpec(productSpecID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/specs/${productSpecID}/`, {
    method: 'GET',
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
  return request(`${apiHost}${apiVersion}/products/${productID}/`, {
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
export async function queryProductSpecs(productID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/${productID}/specs/`, {
    method: 'GET',
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

// 获取推荐商品列表
export async function queryRecommendations(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/product/recommendations/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建推荐商品
export async function createRecommendation(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/product/recommendations/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改推荐商品
export async function patchRecommendation(params, recProductID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/product/recommendations/${recProductID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取所有商品 id name
export async function fetchProductAllIds() {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/all_product_ids/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取所有商品规格 id name
export async function fetchProductSpecAllIds() {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/products/all_product_specs_ids/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取可砍价商品列表
export async function queryBargainsProduct(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/bargains/products/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建可砍价商品
export async function createBargainsProduct(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/bargains/products/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改可砍价商品
export async function patchBargainsProduct(params, bargainProductSpecID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/bargains/products/${bargainProductSpecID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取砍价列表
export async function queryBargains(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/bargains/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取砍价记录
export async function queryBargainsLogs(bargainID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/bargains/${bargainID}/logs/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取可团购商品列表
export async function queryGrouponsProduct(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/groupons/products/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建可团购商品
export async function createGrouponsProduct(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/groupons/products/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改可团购商品
export async function patchGrouponsProduct(params, grouponProductID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/groupons/products/${grouponProductID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取团购列表
export async function queryGroupons(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/groupons/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取团购记录
export async function queryGrouponsLogs(grouponID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/groupons/${grouponID}/logs/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取优惠卷
export async function queryCoupons(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/coupons/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 创建优惠卷
export async function createCoupon(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/coupons/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改优惠卷
export async function patchCoupon(params, couponID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/coupons/${couponID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 优惠卷领取记录
export async function queryCouponsLogs(couponID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/coupons/${couponID}/logs/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取订单列表
export async function queryTransactions(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/transactions/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取单个商品详细信息
export async function fetchTransaction(transactionID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/transactions/${transactionID}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改订单 只可修改实付金额/地址/备注
export async function patchTransaction(params, transactionID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/transactions/${transactionID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// is_superuser 手动关闭订单
export async function manualCloseTransaction(transactionID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/transactions/${transactionID}/manual_close/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// is_superuser 手动确认收货
export async function receivePackageTransaction(transactionID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/transactions/${transactionID}/receive_package/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 发货
export async function createExpress(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/express/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取一个用户的所有地址
export async function queryUserAllAddress(userID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/address/${userID}/all/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取用户列表
export async function queryUsers(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/users/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取单个用户资料
export async function fetchUser(userID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/users/${userID}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改用户资料
export async function patchUser(params, userID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/users/${userID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改用户资料 profile
export async function patchProfile(params, userID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/profile/${userID}/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 删除用户 假删除
export async function deleteUser(userID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/users/${userID}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}


// 获取自提列表
export async function queryCollects(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/collects/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 修改自提订单信息
export async function patchCollect(params, transactionID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/transactions/${transactionID}/collect/`, {
    method: 'PATCH',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 确认自提订单
export async function confirmCollectPickup(params, transactionID) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/transactions/${transactionID}/collect/confirm_pickup/`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}

// 获取门店列表
export async function queryStores(params) {
  const token = getToken();
  return request(`${apiHost}${apiVersion}/stores/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
}
