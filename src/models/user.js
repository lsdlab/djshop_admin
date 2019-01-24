import { fetchCurrent } from '@/services/api';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const responseJSON = yield call(fetchCurrent);
      const response = {"userid":responseJSON.id, "email":responseJSON.email, "username": responseJSON.username, "name": responseJSON.username,"avatar": responseJSON.avatar, "bio": responseJSON.bio, "location": responseJSON.location, "url": responseJSON.url};
      yield put({
        type: 'saveCurrentUser',
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
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
