import {
  queryBanner,
  createBanner,
  patchBanner,
  deleteBanner,
  fetchProductAllIds,
} from '@/services/api';

export default {
  namespace: 'banner',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    allProductIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBanner, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createBanner, payload);
    },
    *patch({ payload, bannerID }, { call }) {
      yield call(patchBanner, payload, bannerID);
    },
    *delete({ bannerID }, { call }) {
      yield call(deleteBanner, bannerID);
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
