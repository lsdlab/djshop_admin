import {
  querySeckills,
  createSeckills,
  querySeckillsLogs,
  fetchProductSpecAllIds,
} from '@/services/api';

export default {
  namespace: 'seckill',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    logData: {
      results: [],
      count: undefined,
    },
    allProductSpecIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySeckills, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createSeckills, payload);
    },
    *fetchLog({ seckillID }, { call, put }) {
      const response = yield call(querySeckillsLogs, seckillID);
      yield put({
        type: 'saveLog',
        payload: response,
      });
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
    saveLog(state, action) {
      return {
        ...state,
        logData: action.payload,
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
