import {
  queryCoupons,
  createCoupon,
  patchCoupon,
  queryCouponsLogs,
  queryCategory,
  fetchProductAllIds,
} from '@/services/api';

export default {
  namespace: 'coupon',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    categoryData: [],
    allProductIds: [],
    logData: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCoupons, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createCoupon, payload);
    },
    *patch({ payload, couponID }, { call, put }) {
      yield call(patchCoupon, payload, couponID);
    },
    *fetchCategory({}, { call, put }) {
      const response = yield call(queryCategory);
      yield put({
        type: 'saveCategory',
        payload: response,
      });
    },
    *fetchProductAllIds({}, { call, put }) {
      const response = yield call(fetchProductAllIds);
      yield put({
        type: 'saveProductAllIds',
        payload: response,
      });
    },
    *fetchLog({ couponID }, { call, put }) {
      const response = yield call(queryCouponsLogs, couponID);
      yield put({
        type: 'saveLogData',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCategory(state, action) {
      return {
        ...state,
        categoryData: action.payload,
      };
    },
    saveProductAllIds(state, action) {
      return {
        ...state,
        allProductIds: action.payload,
      };
    },
    saveLogData(state, action) {
      return {
        ...state,
        logData: action.payload,
      };
    },
  },
};
