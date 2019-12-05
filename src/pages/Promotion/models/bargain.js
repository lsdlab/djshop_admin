import { queryBargains, queryBargainsLogs } from '@/services/api';

export default {
  namespace: 'promotion',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    logData: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBargains, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchLog({ bargainID }, { call, put }) {
      const response = yield call(queryBargainsLogs, bargainID);
      yield put({
        type: 'saveLog',
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
  },
};
