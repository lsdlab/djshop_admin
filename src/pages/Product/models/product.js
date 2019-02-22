import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryCategory, queryProducts, fetchProduct, patchProduct, createProduct, createProductSpec, queryProductSpecs } from '@/services/api';

export default {
  namespace: 'product',

  state: {
    categoryData: [],
    data: {
      results: [],
      count: undefined,
    },
    currentRecord: {},
    newProduct: {},
    newProductSpec: {},
    specData: [],
  },

  effects: {
    *fetchCategory({ }, { call, put }) {
      const response = yield call(queryCategory, );
      yield put({
        type: 'saveCategory',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProducts, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchDetail({ productID }, { call, put }) {
      const response = yield call(fetchProduct, productID);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },
    *patch({ payload, productID }, { call, put }) {
      yield call(patchProduct, payload, productID);
    },
    *createProduct({ payload }, { call, put }) {
      const response = yield call(createProduct, payload);
      yield put({
        type: 'saveNew',
        payload: response,
      });
    },
    *clearNewProduct({ }, { call, put }) {
      yield put({
        type: 'clearNew',
      });
    },
    *createProductSpec({ payload, productID }, { call, put }) {
      yield call(createProductSpec, payload, productID);
    },
    *saveSpecTemp({ payload }, { call, put }) {
      yield put({
        type: 'saveNewSpec',
        payload: payload,
      });
    },
    *fetchProductSpec({ productID }, { call, put }) {
      const response = yield call(queryProductSpecs, productID);
      yield put({
        type: 'saveSpec',
        payload: response,
      });
    },
  },

  reducers: {
    saveCategory(state, action) {
      return {
        ...state,
        categoryData: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        currentRecord: action.payload,
      };
    },
    saveNew(state, action) {
      return {
        ...state,
        newProduct: action.payload,
      };
    },
    clearNew(state, action) {
      return {
        ...state,
        newProduct: {},
        newProductSpec: {},
      };
    },
    saveNewSpec(state, action) {
      return {
        ...state,
        newProductSpec: action.payload,
      };
    },
    saveSpec(state, action) {
      return {
        ...state,
        specData: action.payload,
      };
    }
  },
};
