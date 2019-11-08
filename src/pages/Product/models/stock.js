import { queryReplenishlogs,
         createReplenishlogs,
         fetchStockAllIds,
} from '@/services/api'


export default {
  namespace: 'stock',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    allStockIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryReplenishlogs, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createReplenishlogs, payload);
    },
    *fetchStockAllIds({ payload }, { call, put }) {
      const response = yield call(fetchStockAllIds, payload);
      yield put({
        type: 'saveStockAllIds',
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
    saveStockAllIds(state, action) {
      return {
        ...state,
        allStockIds: action.payload,
      };
    },
  },
};
