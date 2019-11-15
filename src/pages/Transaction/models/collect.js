import {
  queryCollects,
  patchCollect,
  confirmCollectPickup,
  fetchStoreAllIds,
} from '@/services/api';

export default {
  namespace: 'collect',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    allStoreIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCollects, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *patch({ payload, transactionID }, { call, put }) {
      yield call(patchCollect, payload, transactionID);
    },
    *confirmCollectPickup({ transactionID }, { call, put }) {
      yield call(confirmCollectPickup, transactionID);
    },
    *fetchStoreAllIds({}, { call, put }) {
      const response = yield call(fetchStoreAllIds);
      yield put({
        type: 'saveStoreAllIds',
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
    saveStoreAllIds(state, action) {
      return {
        ...state,
        allStoreIds: action.payload,
      };
    },
  },
};
