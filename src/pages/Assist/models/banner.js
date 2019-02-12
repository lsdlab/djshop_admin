import { queryBanner, createBanner, patchBanner, deleteBanner } from '@/services/api'

export default {
  namespace: 'banner',

  state: {
    data: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBanner, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createBanner, payload);
    },
    *patch({ payload, bannerID }, { call, put }) {
      yield call(patchBanner, payload, bannerID);
    },
    *delete({ bannerID }, { call, put }) {
      yield call(deleteBanner, bannerID);
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
