import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryTransactions,
         fetchTransaction,
         patchTransaction,
         manualCloseTransaction,
         receivePackageTransaction,
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
    *patch({ payload, transactionID }, { call, put }) {
      yield call(patchTransaction, payload, transactionID);
    },
    *manualClose({ transactionID }, { call, put }) {
      yield call(manualCloseTransaction, transactionID);
    },
    *receivePackage({ transactionID }, { call, put }) {
      yield call(receivePackageTransaction, transactionID);
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
