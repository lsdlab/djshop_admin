import { querySplash, createSplash, patchSplash, convertSplash } from '@/services/api'

export default {
  namespace: 'splash',

  state: {
    data: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySplash, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createSplash, payload);
    },
    *patch({ payload, splashID }, { call, put }) {
      yield call(patchSplash, payload, splashID);
    },
    *convert({ payload, splashID }, { call, put }) {
      yield call(convertSplash, payload, splashID);
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
