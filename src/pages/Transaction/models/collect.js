import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryCollects,
         patchCollect,
         confirmCollectPickup,
} from '@/services/api';


export default {
  namespace: 'collect',

  state: {
    data: {
      results: [],
      count: undefined,
    },
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
