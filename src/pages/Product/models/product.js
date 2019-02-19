import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, queryCategory, queryProducts, fetchProduct, patchProduct, createProduct, createProductSpec } from '@/services/api';

export default {
  namespace: 'product',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
    categoryData: [],
    data: {
      results: [],
      count: undefined,
    },
    currentRecord: {},
    newProduct: {},
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/product/product-create-step-form/finish'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *fetchCategory({ }, { call, put }) {
      const response = yield call(queryCategory);
      yield put({
        type: 'saveCategory',
        payload: response,
      });
    },

    *fetch({ }, { call, put }) {
      const response = yield call(queryProducts);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({ productID }, { call, put }) {
      const response = yield call(fetchProduct, productID);
      yield put({
        type: 'saveCurrent',
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
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
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
    saveCurrent(state, action) {
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
      };
    },
  },
};
