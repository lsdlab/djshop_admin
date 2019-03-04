import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryGrouponsProduct,
         createGrouponsProduct,
         patchGrouponsProduct,
} from '@/services/api';


export default {
  namespace: 'groupon_product',

  state: {
    data: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryGrouponsProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createGrouponsProduct, payload);
    },
    *patch({ payload, grouponProductID }, { call, put }) {
      yield call(patchGrouponsProduct, payload, grouponProductID);
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
