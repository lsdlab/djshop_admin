import {
  querySplash,
  createSplash,
  patchSplash,
  convertSplash,
  fetchProductAllIds,
} from '@/services/api';

export default {
  namespace: 'splash',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    allProductIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySplash, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createSplash, payload);
    },
    *patch({ payload, splashID }, { call }) {
      yield call(patchSplash, payload, splashID);
    },
    *convert({ payload, splashID }, { call }) {
      yield call(convertSplash, payload, splashID);
    },
    *fetchProductAllIds({ payload }, { call, put }) {
      const response = yield call(fetchProductAllIds, payload);
      yield put({
        type: 'saveProductAllIds',
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
    saveProductAllIds(state, action) {
      return {
        ...state,
        allProductIds: action.payload,
      };
    },
  },
};
