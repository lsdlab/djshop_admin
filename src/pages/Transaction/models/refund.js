import { queryRefunds, patchRefund, auditRefund, withdrawRefund } from '@/services/api';

export default {
  namespace: 'refund',

  state: {
    data: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRefunds, payload);
      yield put({
        type: 'save',
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
