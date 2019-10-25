import { queryReplenishlogs,
         createReplenishlogs,
} from '@/services/api'


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
      const response = yield call(queryReplenishlogs, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createReplenishlogs, payload);
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
