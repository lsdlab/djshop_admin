import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryInvoices,
         patchInvoice,
} from '@/services/api';


export default {
  namespace: 'invoice',

  state: {
    data: {
      results: [],
      count: undefined,
    },
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
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveStoreAllIds(state, action) {
      return {
        ...state,
        allStoreIds: action.payload,
      };
    },
  },
};
