/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    tokenExpires: null,
    refresh: null,
    user: null,
    loading: false,
    error: null,
    isLogged: false,
    paymentDetails: null,
    version: null,
    promotions: null,
    trendingPromotions: null,
    recommendedPromotions: null,
    categories: null,
    transactions: null,
    dashboardStats: null,
    currentUser: null,
    transactionsPartner: null,
    partnerOffer: null,
  },
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
      state.tokenExpires = action.payload.expires;
      state.user = action.payload.user;
      state.isLogged = true;
    },
    refreshTokensSuccess: (state, action) => {
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
      state.tokenExpires = action.payload.expires;
    },
    getUserSuccess: (state, action) => {
      state.user = action.payload.user;
    },
    getCategoriesSuccess: (state, action) => {
      state.categories = action.payload.categories;
    },
    getTransactionsSuccess: (state, action) => {
      state.transactions = action.payload.transactions;
    },
    getTransactionsSuccessPartner: (state, action) => {
      state.transactionsPartner = action.payload.transactions;
    },
    getPromotionsStart: (state) => {
      state.promotions = null;
    },
    getPromotionsSuccess: (state, action) => {
      state.promotions = action.payload.promotions;
    },
    getTrendingPromotionsSuccess: (state, action) => {
      state.trendingPromotions = action.payload.promotions;
    },
    getRecommendedPromotionsSuccess: (state, action) => {
      state.recommendedPromotions = action.payload.promotions;
    },
    getVersionSuccess: (state, action) => {
      state.version = action.payload.version;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.token = null;
      state.tokenExpires = null;
      state.refresh = null;
      state.user = null;
      state.loading = !state.loading;
      state.error = null;
      state.isLogged = false;
    },
    paymentDetailsSuccess: (state, action) => {
      state.paymentDetails = action.payload;
    },
    paymentDetailsError: (state) => {
      state.paymentDetails = null;
    },
    setCustomerDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setCurrentUserDetails: (state, action) => {
      state.currentUser = action.payload;
    },
    setPartnerOffer: (state, action) => {
      state.partnerOffer = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  getUserSuccess,
  loginFailure,
  logout,
  paymentDetailsSuccess,
  paymentDetailsError,
  getVersionSuccess,
  getCategoriesSuccess,
  getPromotionsSuccess,
  getTrendingPromotionsSuccess,
  getRecommendedPromotionsSuccess,
  getPromotionsStart,
  refreshTokensSuccess,
  getTransactionsSuccess,
  setCustomerDashboardStats,
  setCurrentUserDetails,
  getTransactionsSuccessPartner,
  setPartnerOffer,
} = authSlice.actions;
export default authSlice.reducer;
