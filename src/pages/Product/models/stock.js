import { queryStocks, createStocks, deleteStocks, queryStocksReplenishlogs } from '@/services/api';

export default {
  namespace: 'stock',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    logData: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStocks, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createStocks, payload);
    },
    *delete({ stockID }, { call }) {
      yield call(deleteStocks, stockID);
    },
    *fetchLog({ stockID }, { call, put }) {
      const response = yield call(queryStocksReplenishlogs, stockID);
      yield put({
        type: 'saveLog',
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
    saveLog(state, action) {
      return {
        ...state,
        logData: action.payload,
      };
    },
  },
};
