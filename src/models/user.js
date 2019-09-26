import {
  fetchCurrent,
  fetchCurrentMerchant,
  queryUsers,
  fetchUser,
  patchUser,
  patchProfile,
  deleteUser,
  fetchActivityStream,
} from '@/services/api';


export default {
  namespace: 'user',

  state: {
    currentUser: {},
    currentMerchant: {},
    data: {
      count: undefined,
      results: [],
    },
    currentRecord: {},
    activitystream: {
      count: undefined,
      results: [],
    },
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const responseJSON = yield call(fetchCurrent);
      const response = {"userid": responseJSON.id, "email": responseJSON.email, "username": responseJSON.username, "name": responseJSON.username,"avatar": responseJSON.avatar, "bio": responseJSON.bio, "location": responseJSON.location, "url": responseJSON.url, "date_joined": responseJSON.date_joined};
      localStorage.setItem('currentUser', JSON.stringify(response));

      const responseMerchantJSON = yield call(fetchCurrentMerchant, '1');
      const responseMerchant = {"merchantid": responseMerchantJSON.id, "merchantname": responseMerchantJSON.name, "merchantmobile": responseMerchantJSON.mobile, "merchantremark": responseMerchantJSON.remark, "merchantdeleted": responseMerchantJSON.deleted, "merchantcreatedat": responseMerchantJSON.created_at, "merchantupdatedat": responseMerchantJSON.updated_at};
      localStorage.setItem('currentMerchant', JSON.stringify(responseMerchant));

      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      yield put({
        type: 'saveCurrentMerchant',
        payload: responseMerchantJSON,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchDetail({ userID }, { call, put }) {
      const response = yield call(fetchUser, userID);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },
    *patch({ payload, userID }, { call, put }) {
      yield call(patchUser, payload, userID);
    },
    *patchProfile({ payload, userID }, { call, put }) {
      yield call(patchProfile, payload, userID);
    },
    *delete({ userID }, { call, put }) {
      yield call(deleteUser, userID);
    },
    *fetchActivityStream({ payload }, { call, put }) {
      const response = yield call(fetchActivityStream, payload);
      yield put({
        type: 'saveActivityStream',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveCurrentMerchant(state, action) {
      return {
        ...state,
        currentMerchant: action.payload || {},
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
    saveActivityStream(state, action) {
      return {
        ...state,
        activitystream: action.payload,
      };
    },
  },
};
