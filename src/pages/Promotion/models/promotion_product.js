import {
  queryPromotionsProduct,
  createPromotionsProduct,
  patchPromotionsProduct,
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
      const response = yield call(queryPromotionsProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createPromotionsProduct, payload);
    },
    *patch({ payload, promotionProductSpecID }, { call }) {
      yield call(patchPromotionsProduct, payload, promotionProductSpecID);
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
