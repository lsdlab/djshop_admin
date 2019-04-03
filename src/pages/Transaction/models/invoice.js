import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryInvoices,
         patchInvoice,
         queryUserAllAddress,
} from '@/services/api';


export default {
  namespace: 'invoice',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    userAllAddress: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryInvoices, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *patch({ payload, transactionID }, { call, put }) {
      yield call(patchInvoice, payload, transactionID);
    },
    *fetchUserAllAddress({ userID }, { call, put }) {
      const response = yield call(queryUserAllAddress, userID);
      yield put({
        type: 'saveUserAllAddress',
        payload: response,
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveUserAllAddress(state, action) {
      return {
        ...state,
        userAllAddress: action.payload,
      };
    },
  },
};
