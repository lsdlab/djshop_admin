import {
  queryTransactions,
  fetchTransaction,
  patchTransaction,
  manualCloseTransaction,
  createExpress,
  queryUserAllAddress,
  wxPaymentOrderQuery,
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
    wxQueryOrderDetail: {},
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
    *patch({ payload, transactionID }, { call }) {
      yield call(patchTransaction, payload, transactionID);
    },
    *manualClose({ transactionID }, { call }) {
      yield call(manualCloseTransaction, transactionID);
    },
    *createExpress({ payload, transactionID }, { call }) {
      yield call(createExpress, payload, transactionID);
    },
    *fetchUserAllAddress({ userID }, { call, put }) {
      const response = yield call(queryUserAllAddress, userID);
      yield put({
        type: 'saveUserAllAddress',
        payload: response,
      });
    },
    *wxPaymentOrderQuery({ params }, { call, put }) {
      const response = yield call(wxPaymentOrderQuery, params);
      yield put({
        type: 'saveOrderQueryDetail',
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
    saveUserAllAddress(state, action) {
      return {
        ...state,
        userAllAddress: action.payload,
      };
    },
    saveOrderQueryDetail(state, action) {
      return {
        ...state,
        wxQueryOrderDetail: action.payload,
      };
    },
  },
};
