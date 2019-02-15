import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, queryCategory } from '@/services/api';

export default {
  namespace: 'product',

  state: {
    categoryData: [],
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
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
  },
};
