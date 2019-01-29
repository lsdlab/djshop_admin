import { queryArticles, createArticle, patchArticle, deleteArticle } from '@/services/api'

export default {
  namespace: 'articles',

  state: {
    data: {
      results: [],
      count: undefined,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryArticles, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call, put }) {
      yield call(createArticle, payload);
    },
    *patch({ payload, articleID }, { call, put }) {
      yield call(patchArticle, payload, articleID);
    },
    *delete({ payload, articleID }, { call, put }) {
      yield call(deleteArticle, articleID);
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
