import { fetchActivityStream, } from '@/services/api';

export default {
  namespace: 'activities',

  state: {
    list: [],
    data: {
      count: undefined,
      results: [],
    },
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(fetchActivityStream);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchActivityStream, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
