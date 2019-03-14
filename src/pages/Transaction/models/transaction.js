import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryTransactions,
         fetchTransaction,
         patchTransaction,
         manualCloseTransaction,
         receivePackageTransaction,
         createExpress,
         queryUserAllAddress,
} from '@/services/api';


export default {
  namespace: 'transaction',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    currentRecord: {},
    userAllAddress: [],
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
    *createExpress({ payload }, { call, put }) {
      yield call(createExpress, payload);
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
    saveDetail(state, action) {
      return {
        ...state,
        currentRecord: action.payload,
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
