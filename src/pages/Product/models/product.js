import { routerRedux } from 'dva/router';
import {
  queryCategory,
  queryProducts,
  fetchProduct,
  createProduct,
  patchProduct,
  createProductSpec,
  queryProductSpecs,
  patchProductSpec,
  fetchProductSpec,
  queryProductReviews,
  queryRecommendations,
  createRecommendation,
  patchRecommendation,
  fetchProductAllIds,
  createBargainsProduct,
  createGrouponsProduct,
} from '@/services/api';

export default {
  namespace: 'product',

  state: {
    categoryData: [],
    data: {
      results: [],
      count: undefined,
    },
    currentRecord: {},
    newProduct: {},
    newProductSpec: {},
    specData: [],
    reviewData: {
      results: [],
      count: undefined,
    },
    specCurrentRecord: {},
    recData: {
      results: [],
      count: undefined,
    },
    newRecProduct: {},
    allProductIds: [],
  },

  effects: {
    *fetchCategory({}, { call, put }) {
      const response = yield call(queryCategory);
      yield put({
        type: 'saveCategory',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProducts, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchDetail({ productID }, { call, put }) {
      const response = yield call(fetchProduct, productID);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },
    *createProduct({ payload }, { call, put }) {
      const response = yield call(createProduct, payload);
      yield put({
        type: 'saveNew',
        payload: response,
      });
      yield put(
        routerRedux.push({
          pathname: '/product/product-create-step-form/spec',
          state: { productID: response.id },
        })
      );
    },
    *patch({ payload, productID }, { call, put }) {
      yield call(patchProduct, payload, productID);
    },
    *clearNewProduct({}, { put }) {
      yield put({
        type: 'clearNew',
      });
    },
    *createProductSpec({ payload, productID }, { call }) {
      yield call(createProductSpec, payload, productID);
    },
    *saveSpecTemp({ payload }, { put }) {
      yield put({
        type: 'saveNewSpec',
        payload: payload,
      });
    },
    *fetchProductSpecs({ payload, productID }, { all, call, put }) {
      const response = yield call(queryProductSpecs, productID);
      yield put({
        type: 'saveSpecs',
        payload: response,
      });

      // const [specResponse, reviewResponse] = yield all([
      //   call(queryProductSpecs, productID),
      //   call(queryProductReviews, payload, productID),
      // ]);
      // yield put({
      //   type: 'saveSpecs',
      //   payload1: specResponse,
      //   payload2: reviewResponse,
      // });
    },
    *fetchProductReviews({ payload, productID }, { call, put }) {
      const response = yield call(queryProductReviews, payload, productID);
      yield put({
        type: 'saveReviews',
        payload: response,
      });
    },
    *patchProductSpec({ payload, productSpecID }, { call, put }) {
      yield call(patchProductSpec, payload, productSpecID);
    },
    *fetchProductSpecDetail({ productSpecID }, { call, put }) {
      const response = yield call(fetchProductSpec, productSpecID);
      yield put({
        type: 'saveSpecDetail',
        payload: response,
      });
    },
    *fetchRecProduct({}, { call, put }) {
      const response = yield call(queryRecommendations);
      yield put({
        type: 'saveRec',
        payload: response,
      });
    },
    *createRecProduct({ payload }, { call, put }) {
      const response = yield call(createRecommendation, payload);
      yield put({
        type: 'saveNewRecProduct',
        payload: response,
      });
    },
    *patchRecProduct({ payload, recProductID }, { call, put }) {
      yield call(patchRecommendation, payload, recProductID);
    },
    *fetchProductAllIds({ payload }, { call, put }) {
      const response = yield call(fetchProductAllIds, payload);
      yield put({
        type: 'saveProductAllIds',
        payload: response,
      });
    },
    *createBargainProduct({ payload }, { call, put }) {
      yield call(createBargainsProduct, payload);
    },
    *createGrouponProduct({ payload }, { call, put }) {
      yield call(createGrouponsProduct, payload);
    },
  },

  reducers: {
    saveCategory(state, action) {
      return {
        ...state,
        categoryData: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        currentRecord: action.payload,
      };
    },
    saveNew(state, action) {
      return {
        ...state,
        newProduct: action.payload,
      };
    },
    clearNew(state, action) {
      return {
        ...state,
        newProduct: {},
        newProductSpec: {},
      };
    },
    saveNewSpec(state, action) {
      return {
        ...state,
        newProductSpec: action.payload,
      };
    },
    saveSpecs(state, action) {
      return {
        ...state,
        specData: action.payload,
        // reviewData: action.payload2
      };
    },
    saveReviews(state, action) {
      return {
        ...state,
        reviewData: action.payload,
      };
    },
    saveSpecDetail(state, action) {
      return {
        ...state,
        specCurrentRecord: action.payload,
      };
    },
    saveRec(state, action) {
      return {
        ...state,
        recData: action.payload,
      };
    },
    saveNewRecProduct(state, action) {
      return {
        ...state,
        newRecProduct: action.payload,
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
