import { queryNotice, createNotice, deleteNotice } from '@/services/api'

export default {
  namespace: 'notice',

  state: {
    data: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryNotice, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createNotice, payload);
    },
    *delete({ noticeID }, { call, put }) {
      yield call(deleteNotice, noticeID);
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
