import {
  queryBargainsProduct,
  createBargainsProduct,
  patchBargainsProduct,
  fetchProductSpecAllIds,
} from '@/services/api';

export default {
  namespace: 'promotion_product',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    allProductSpecIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBargainsProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createBargainsProduct, payload);
    },
    *patch({ payload, bargainProductSpecID }, { call }) {
      yield call(patchBargainsProduct, payload, bargainProductSpecID);
    },
    *fetchProductSpecAllIds({}, { call, put }) {
      const response = yield call(fetchProductSpecAllIds);
      yield put({
        type: 'saveProductSpecAllIds',
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
    saveProductSpecAllIds(state, action) {
      return {
        ...state,
        allProductSpecIds: action.payload,
      };
    },
  },
};
