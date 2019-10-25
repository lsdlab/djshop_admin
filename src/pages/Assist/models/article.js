import { queryArticles,
         createArticle,
         patchArticle,
         fetchArticle,
         fetchProductAllIds,
} from '@/services/api'


export default {
  namespace: 'article',

  state: {
    data: {
      results: [],
      count: undefined,
    },
    currentRecord: {},
    allProductIds: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryArticles, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload }, { call }) {
      yield call(createArticle, payload);
    },
    *patch({ payload, articleID }, { call }) {
      yield call(patchArticle, payload, articleID);
    },
    *fetchCurrent({ articleID }, { call, put }) {
      const response = yield call(fetchArticle, articleID);
      yield put({
        type: 'saveCurrent',
        payload: response,
      });
    },
    *fetchProductAllIds({}, { call, put }) {
      const response = yield call(fetchProductAllIds);
      yield put({
        type: 'saveProductAllIds',
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
    saveProductAllIds(state, action) {
      return {
        ...state,
        allProductIds: action.payload,
      };
    },
  },
};
