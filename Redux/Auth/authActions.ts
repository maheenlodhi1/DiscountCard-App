/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable semi */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
// authActions.js
import axios from "axios";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  paymentDetailsSuccess,
  paymentDetailsError,
  getUserSuccess,
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
} from "./authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, PYTHON_URL } from "../../Utils/utils";

const routes = {
  register: "/auth/register",
  login: "/auth/login",
  sendOTP: "/auth/send-otp",
  verifyOTP: "/auth/verify-otp",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  paymentDetails: "/users/payment-details",
  promotions: "/promotions",
  users: "/users",
  categories: "/categories?limit=1000",
  updatePaymentDetails: "/users/update-payment-details",
  verifyID: "https://service.ndendefrs.com/ndidaas/verify",
  verifyImages: "https://service.ndendefrs.com/api/v2/Verify",
  makepayment: "/payment",
  ozowPaymentRequest: "https://api.ozow.com/postpaymentrequest",
  generic: "/generic/?type=version",
  tracking: "/generic/usertracking/6657989300dd4c5ceef5915d",
  getSubscription: "/subscription-types",
  buySubscription: "/subscriptions/buy-subscription",
  coupons: "/coupons/apply-coupon",
  checkMembership: "/subscriptions/membership",
  customers: "/customers",
  refreshTokens: "/auth/refresh-tokens",
  changePassword: "/auth/change-password",
  uploadImages: "/upload/images",
  transactions: "/transactions",
  transactionsCustomer: "/transactions/customers",
  transactionsPartner: "/transactions/partners",
  reviews: "/reviews",
  managePayoutDetails: "/payments/manage-payout",
  payoutDetails: "/payments/payout/account-details",
  payoutRequests: "/payout-requests",
  contactUs: `/contactUs/internal`,
  promotionReviews: `/promotions/promotionId/reviews`,
  customerDashboard: "/customers/dashboard",
  currentUser: "/auth/me",
  createPayoutRequest: "/payments/withdraw",
  showPopupAd: "/content-ad/show",
  verifySub: "/subscriptions/check-subscription",
  SubscriptionContactUs: "/contactUs",
  createPromotions: "/promotions",
  offerRedeem: `/promotions/redeem-offer`,
  partnerDashboardStats: "/partners/app/dashboard/stats",
  partners: "/partners",
  trending: "/trending_deals",
  recommended: "/recommended_deals",
  addEvent: "/promotions/events",
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token from AsyncStorage:", error);
    return null;
  }
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refresh");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${API_URL}${routes.refreshTokens}`, {
      refreshToken,
    });

    const newToken = response.data?.tokens?.access?.token;
    const newRefresh = response.data?.tokens?.refresh?.token;

    if (newToken) {
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("refresh", newRefresh);
      axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      return newToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

// **Request Interceptor** - Attach token to every request
axios.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **Response Interceptor** - Refresh token if expired
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request failed due to expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for token refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const getVersion = () => async (dispatch: any) => {
  try {
    const response = await axios.get(`${API_URL}${routes.generic}`);
    let version = response?.data?.results[0];
    dispatch(getVersionSuccess({ version }));
  } catch (error: any) {
    console.log(error?.response?.data?.message);
  }
};

export const checkMembership =
  (handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(`${API_URL}${routes.checkMembership}`);
      handleCallBack("Success", response?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const checkSub =
  (code: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(`${API_URL}${routes.verifySub}/${code}`);
      handleCallBack("Success", response?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const getCategories = () => async (dispatch: any) => {
  try {
    const response = await axios.get(`${API_URL}${routes.categories}`);
    // let version = response?.data?.results[0];
    let categories = response?.data;
    dispatch(getCategoriesSuccess({ categories }));
  } catch (error: any) {
    console.log(error?.response?.data?.message);
  }
};

export const getPromotions = (query: any) => async (dispatch: any) => {
  try {
    dispatch(getPromotionsStart());
    const response = await axios.get(`${API_URL}${routes.promotions}?${query}`);
    let promotions = response?.data;
    dispatch(getPromotionsSuccess({ promotions }));
  } catch (error: any) {
    console.log(error?.response?.data?.message);
  }
};

export const getTrendingPromotions = (query: any) => async (dispatch: any) => {
  try {
    // dispatch(getPromotionsStart());
    const response = await axios.get(
      `${PYTHON_URL}${routes.trending}?${query}`
    );
    let promotions = response?.data;

    dispatch(getTrendingPromotionsSuccess({ promotions }));
  } catch (error: any) {
    console.log(error?.response?.data?.message);
  }
};

export const getRecommendedPromotions =
  (query: any) => async (dispatch: any) => {
    try {
      // dispatch(getPromotionsStart());
      const response = await axios.get(
        `${PYTHON_URL}${routes.recommended}/${query}`
      );
      let promotions = response?.data;
      dispatch(getRecommendedPromotionsSuccess({ promotions }));
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    }
  };

export const getPromotionByID =
  (id: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(`${API_URL}${routes.promotions}/${id}`);
      let promotion = response?.data;
      handleCallBack("Success", promotion);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
    }
  };

export const login =
  (credentials: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      dispatch(loginRequest());
      const response = await axios.post(
        `${API_URL}${routes.login}`,
        credentials
      );
      const { tokens, user } = response.data;
      let token = tokens?.access?.token;
      let refresh = tokens?.refresh?.token;
      let expires = tokens?.access?.expires;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refresh", refresh);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("isLoggedIn", "true");
      dispatch(loginSuccess({ token, user, refresh, expires }));
      handleCallBack("Success", user);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      dispatch(loginFailure(error?.response?.data?.message));
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const refreshTokens =
  (credentials: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.refreshTokens}`,
        credentials
      );
      const { tokens } = response.data;
      let token = tokens?.access?.token;
      let refresh = tokens?.refresh?.token;
      let expires = tokens?.access?.expires;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refresh", refresh);
      dispatch(refreshTokensSuccess({ token, refresh, expires }));
      handleCallBack("Success", tokens);
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const logoutUser = (handleCallBack: any) => async (dispatch: any) => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("refresh");
  await AsyncStorage.removeItem("user");
  await AsyncStorage.setItem("isLoggedIn", "false");
  dispatch(logout());
  handleCallBack("Success", "Logout Success");
};

export const sendOTP =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(`${API_URL}${routes.sendOTP}`, payload);
      console.log(response.data);

      handleCallBack("Success", "OTP Sent");
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const verifyOTP =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.verifyOTP}`,
        payload
      );
      const { isValid, token } = response.data;
      if (isValid) {
        handleCallBack("Success", token);
      } else {
        handleCallBack("Error", "OTP not verified please try again");
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const getSubscription =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${API_URL}${routes.getSubscription}?type=${payload}`
      );

      handleCallBack("Success", response?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const buySubscription =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${API_URL}${routes.buySubscription}?${payload}`
      );

      handleCallBack("Success", response?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const applyCoupons =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(`${API_URL}${routes.coupons}`, payload);

      handleCallBack("Success", response?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const register =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.register}`,
        payload
      );

      handleCallBack("Success", "User Registered");
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

// export const makePayment =
//   (payload: any, handleCallBack: any) => async (dispatch: any) => {
//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//         ApiKey: OZOW_API_KEY,
//       };
//       const response = await axios.post(
//         `${routes.ozowPaymentRequest}`,
//         payload,
//         {headers},
//       );

//       handleCallBack('Success', response?.data);
//     } catch (error: any) {
//       console.log(error);
//       handleCallBack('Error', error?.response?.data?.message);
//     }
//   };

const handlecallback = () => {};

// export const makePayment =
//   (payload: any, handleCallBack: any) => async (dispatch: any) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}${routes.makepayment}`,
//         payload,
//       );

//       handleCallBack('Success', response?.data);
//     } catch (error: any) {
//       console.log(error?.response?.data?.message);
//       handleCallBack('Error', error?.response?.data?.message);
//     }
//   };

// export const verifyID =
//   (payload: any, handleCallBack: any) => async (dispatch: any) => {
//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//         'Ocp-Apim-Subscription-Key': NDENDE_KEY,
//       };
//       const response = await axios.post(`${routes.verifyID}`, payload, {
//         headers,
//       });

//       handleCallBack('Success', response.data);
//     } catch (error: any) {
//       console.log(error?.response?.data?.message);
//       handleCallBack('Error', error?.response?.data);
//     }
//   };
// export const verifyImages =
//   (payload: any, handleCallBack: any) => async (dispatch: any) => {
//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//         'Customer-Subscription-Key': NDENDE_KEY,
//       };
//       const response = await axios.post(`${routes.verifyImages}`, payload, {
//         headers,
//       });
//       console.log(response);
//       handleCallBack('Success', response.data);
//     } catch (error: any) {
//       console.log(error);
//       handleCallBack('Error', error?.response?.data);
//     }
//   };

export const forgotPassword =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.forgotPassword}`,
        payload
      );
      console.log(response);
      handleCallBack("Success", "OTP Sent");
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", "OTP could not send please try again");
    }
  };

export const resetPassword =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.resetPassword}`,
        payload
      );
      console.log(response);
      handleCallBack("Success", "Password Reset");
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const addPaymentDetails =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.paymentDetails}`,
        payload
      );
      console.log(response);
      handleCallBack("Success", "Payment Details Added");
      dispatch(paymentDetailsSuccess(payload.accountDetails));
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

// export const getUserWallet = (payload: any) => async (dispatch: any) => {
//   try {
//     const response = await axios.get(
//       `${API_URL}${routes.wallet}/${payload.userId}`
//     );
//     dispatch(paymentDetailsSuccess(response?.data));
//   } catch (error: any) {
//     dispatch(paymentDetailsError());
//     console.log(error?.response?.data?.message);
//   }
// };

export const updatePaymentDetails =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    let d = {
      accountDetails: {
        cardName: payload.accountDetails.cardName,
        cardNumber: payload.accountDetails.cardNumber,
        expiryMonth: payload.accountDetails.expiryMonth,
        expiryYear: payload.accountDetails.expiryYear,
        cvv: payload.accountDetails.cvv,
        cardType: payload.accountDetails.cardType,
      },
    };
    try {
      const response = await axios.put(
        `${API_URL}${routes.updatePaymentDetails}/${payload.userId}`,
        d
      );
      console.log(response);
      handleCallBack("Success", "Payment Details Updated");
      dispatch(paymentDetailsSuccess(response?.data));
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const trackingUserScreens = (payload: any) => async (dispatch: any) => {
  let data = {
    data: payload,
  };
  try {
    let val = await getCountStorage(payload);
    if (!val) {
      const response = await axios.put(`${API_URL}${routes.tracking}`, data);
      await setCountStorage(payload);
    }
  } catch (error: any) {}
};

const setCountStorage = async (payload: any) => {
  try {
    const fieldName = Object.keys(payload)[0];
    const prefixedFieldName = `tracking_${fieldName}`;
    await AsyncStorage.setItem(prefixedFieldName, "true");
  } catch (error) {
    console.error("Error setting item in AsyncStorage:", error);
  }
};

const getCountStorage = async (payload: any) => {
  try {
    const fieldName = Object.keys(payload)[0];
    const prefixedFieldName = `tracking_${fieldName}`;
    const value = await AsyncStorage.getItem(prefixedFieldName);
    return value;
  } catch (error) {
    console.error("Error getting item from AsyncStorage:", error);
    return null;
  }
};

export const updateCustomer =
  (payload: any, userId: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.put(
        `${API_URL}${routes.customers}/${userId}`,
        payload
      );
      let user = response?.data;
      console.log("user", user);

      handleCallBack("Success", "User Details Updated");
      dispatch(getUserSuccess({ user }));
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const updatePartner =
  (payload: any, userId: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.put(
        `${API_URL}${routes.partners}/${userId}`,
        payload
      );
      let user = response?.data;
      console.log("user", user);

      handleCallBack("Success", "User Details Updated");
      dispatch(getUserSuccess({ user }));
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const changePassword =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.changePassword}`,
        payload
      );
      console.log(response);

      handleCallBack("Success", "Password changed successfully");
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const uploadImages =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        `${API_URL}${routes.uploadImages}`,
        payload,
        config
      );

      // console.log("Upload Success:", response.data);
      handleCallBack("Success", response?.data);
    } catch (error: any) {
      // console.error(
      //   "Upload Error:",
      //   error?.response?.data?.message || error.message
      // );
      handleCallBack(
        "Error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

export const getCustomer = (userId: any) => async (dispatch: any) => {
  try {
    const response = await axios.get(`${API_URL}${routes.customers}/${userId}`);
    let user = response.data;
    dispatch(getUserSuccess({ user }));
  } catch (error: any) {
    if (
      error?.response?.data?.message == "User not found" ||
      error?.response?.data?.message == "Something went wrong"
    ) {
      dispatch(logoutUser(handlecallback));
    }
    console.log("Error", error?.response?.data?.message);
  }
};

export const getTransactions =
  (id: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${API_URL}${routes.transactionsCustomer}/${id}?limit=100000000`
      );
      let transactions = response?.data;
      dispatch(getTransactionsSuccess({ transactions }));
      // handleCallBack("Success", response?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      // handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const getTransactionsPartner =
  (id: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${API_URL}${routes.transactionsPartner}/${id}?limit=100000000`
      );
      let transactions = response?.data;
      dispatch(getTransactionsSuccessPartner({ transactions }));
      // handleCallBack("Success", response?.data);
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      // handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const getTransactionByID =
  (id: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${API_URL}${routes.transactions}/${id}`
      );
      let transaction = response?.data;

      handleCallBack("Success", transaction);
    } catch (error: any) {
      // console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const addReview =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(`${API_URL}${routes.reviews}`, payload);
      const data = response?.data;

      handleCallBack("Success", "Review added successfully");
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const managePayoutDetails =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.managePayoutDetails}`,
        payload
      );
      const data = response?.data;

      handleCallBack("Success", "Payout details updated successfully");
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const getCustomerPayoutDetails =
  (handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(`${API_URL}${routes.payoutDetails}`);
      let payoutDetails = response?.data;

      handleCallBack("Success", payoutDetails);
    } catch (error: any) {
      // console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const getCustomerPayoutRequests =
  (id: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(`${API_URL}${routes.payoutRequests}`);
      let payoutRequests = response?.data;

      handleCallBack("Success", payoutRequests);
    } catch (error: any) {
      // console.log(error?.response?.data?.message);
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const getPromotionReviews =
  (
    promotionId: string,
    sortBy = "",
    handleCallBack: (status: string, data: any) => void
  ) =>
  async (dispatch: any) => {
    try {
      const url = `${API_URL}${routes.promotionReviews.replace(
        "promotionId",
        promotionId
      )}${sortBy ? `?sort=${sortBy}` : ""}`;

      const response = await axios.get(url);

      const reviewsData = response?.data;

      handleCallBack("Success", reviewsData);
    } catch (error: any) {
      handleCallBack(
        "Error",
        error?.response?.data?.message || "Failed to fetch reviews"
      );
    }
  };

export const contactUs =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.contactUs}`,
        payload
      );

      handleCallBack(
        "Success",
        "Your request has been sent to admin he will contact you soon"
      );
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const fetchCustomerDashboardStats =
  (handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(`${API_URL}${routes.customerDashboard}`);

      handleCallBack(
        "Success",
        "Your request has been sent to admin he will contact you soon"
      );
      dispatch(setCustomerDashboardStats(response.data));
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const fetchCurrentUserDetails = () => async (dispatch: any) => {
  try {
    const response = await axios.get(`${API_URL}${routes.currentUser}`);
    console.log("ResponseData", response?.data);

    dispatch(setCurrentUserDetails(response.data));
  } catch (error: any) {}
};

export const createPayoutRequest =
  (handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${API_URL}${routes.createPayoutRequest}`
      );
      handleCallBack("Success", "Payout Request created Successfully");
    } catch (error: any) {
      handleCallBack(
        "Error",
        error?.response?.data?.message || "Failed create payout request"
      );
    }
  };

export const showPopAd = (handleCallBack: any) => async (dispatch: any) => {
  try {
    const response = await axios.get(`${API_URL}${routes.showPopupAd}`);
    handleCallBack("Success", response?.data);
  } catch (error: any) {
    handleCallBack(
      "Error",
      error?.response?.data?.message || "Failed create payout request"
    );
  }
};

export const PostSubscriptionRequest =
  (handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${API_URL}${routes.SubscriptionContactUs}`
      );

      handleCallBack(
        "Success",
        "Your request has been sent to admin he will contact you soon"
      );
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const createPromotion =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.createPromotions}`,
        payload
      );

      handleCallBack("Success", "Offer created successfully!");
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const addEvent =
  (payload: any, handleCallBack: any) => async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.addEvent}`,
        payload
      );

      handleCallBack("Success", "Event added successfully!");
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const updatePromotion =
  (promotionId: any, payload: any, handleCallBack: any) =>
  async (dispatch: any) => {
    try {
      const response = await axios.put(
        `${API_URL}${routes.createPromotions}/${promotionId}`,
        payload
      );

      handleCallBack("Success", "Offer updated successfully!");
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const OfferRedeem =
  (promotionId: any, payload: any, handleCallBack: any) =>
  async (dispatch: any) => {
    try {
      const response = await axios.post(
        `${API_URL}${routes.offerRedeem}/${promotionId}`,
        payload
      );

      handleCallBack("Success", "Offer redeemed successfully!");
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };

export const getPartnerDashboardStats =
  (handleCallBack: any, period: string) => async (dispatch: any) => {
    try {
      const response = await axios.get(
        `${API_URL}${routes.partnerDashboardStats}?period=${period}`
      );
      console.log("data", response.data);

      handleCallBack("Success", response?.data);
    } catch (error: any) {
      handleCallBack("Error", error?.response?.data?.message);
    }
  };
