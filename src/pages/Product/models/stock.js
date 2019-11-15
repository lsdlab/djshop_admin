import { queryStocks, createStocks, deleteStocks } from '@/services/api';

export default {
  namespace: 'stock',

  state: {
    data: {
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
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
