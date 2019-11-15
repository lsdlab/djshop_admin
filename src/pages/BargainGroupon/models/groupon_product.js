import {
  queryGrouponsProduct,
  createGrouponsProduct,
  patchGrouponsProduct,
  fetchProductSpecAllIds,
} from '@/services/api';

export default {
  namespace: 'groupon_product',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    allProductSpecIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryGrouponsProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createGrouponsProduct, payload);
    },
    *patch({ payload, grouponProductSpecID }, { call }) {
      yield call(patchGrouponsProduct, payload, grouponProductSpecID);
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
