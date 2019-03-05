import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryGroupons, queryGrouponsLogs } from '@/services/api';


export default {
  namespace: 'groupon',

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
      const response = yield call(queryGroupons, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchLog({ grouponID }, { call, put }) {
      const response = yield call(queryGrouponsLogs, grouponID);
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
