import { queryArticles, createArticle, patchArticle, fetchArticle } from '@/services/api'

export default {
  namespace: 'articles',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    currentRecord: {},
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
    *fetchCurrent({ articleID }, { call, put }) {
      const response = yield call(fetchArticle, articleID);
      yield put({
        type: 'saveCurrent',
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
    saveCurrent(state, action) {
      return {
        ...state,
        currentRecord: action.payload,
      };
    },
  },
};
