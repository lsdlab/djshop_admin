import { queryCategory, createCategory, patchCategory } from '@/services/api'

export default {
  namespace: 'category',

  state: {
    data: [],
  },

  effects: {
    *fetch({ }, { call, put }) {
      const response = yield call(queryCategory);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createCategory, payload);
    },
    *patch({ payload, categoryID }, { call, put }) {
      yield call(patchCategory, payload, categoryID);
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
