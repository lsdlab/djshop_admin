import {
  createRefund,
  queryRefunds,
  fetchRefund,
  patchRefund,
  auditRefund,
  withdrawRefund,
  weixinpaymentRefundOrder,
  weixinpaymentRefundQuery,
} from '@/services/api';

export default {
  namespace: 'refund',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    currentRecord: {},
    wxRefundQueryDetail: {},
  },

  effects: {
    *create({ payload, transactionID }, { call }) {
      yield call(createRefund, payload, transactionID);
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRefunds, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchRefund({ transactionID }, { call, put }) {
      const response = yield call(fetchRefund, transactionID);
      yield put({
        type: 'saveRefund',
        payload: response,
      });
    },
    *patch({ payload, transactionID }, { call }) {
      yield call(patchRefund, payload, transactionID);
    },
    *auditRefund({ payload, transactionID }, { call }) {
      yield call(auditRefund, payload, transactionID);
    },
    *withdrawRefund({ transactionID }, { call }) {
      yield call(withdrawRefund, transactionID);
    },
    *weixinpaymentRefundQuery({ params }, { call, put }) {
      const response = yield call(weixinpaymentRefundQuery, params);
      yield put({
        type: 'saveRefundQueryDetail',
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
    saveRefund(state, action) {
      return {
        ...state,
        currentRecord: action.payload,
      };
    },
    saveStoreAllIds(state, action) {
      return {
        ...state,
        allStoreIds: action.payload,
      };
    },
    saveRefundQueryDetail(state, action) {
      return {
        ...state,
        wxRefundQueryDetail: action.payload,
      };
    },
  },
};
