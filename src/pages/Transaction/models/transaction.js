import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryTransactions,
         fetchTransaction,
} from '@/services/api';


export default {
  namespace: 'transacction',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    currentRecord: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTransactions, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchDetail({ transactionID }, { call, put }) {
      const response = yield call(fetchTransaction, transactionID);
      yield put({
        type: 'saveDetail',
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
    saveDetail(state, action) {
      return {
        ...state,
        currentRecord: action.payload,
      };
    },
  },
};
