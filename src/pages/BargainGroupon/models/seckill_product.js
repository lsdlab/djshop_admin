import {
  querySeckillsProduct,
  createSeckillsProduct,
  patchSeckillsProduct,
  fetchProductSpecAllIds,
} from '@/services/api';

export default {
  namespace: 'seckill_product',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    allProductSpecIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySeckillsProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createSeckillsProduct, payload);
    },
    *patch({ payload, seckillProductSpecID }, { call }) {
      yield call(patchSeckillsProduct, payload, seckillProductSpecID);
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
