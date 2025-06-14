import { axiosInstance } from "./axios.js";

export const getAuthUser = async () => {
  const res = await axiosInstance.get("auth/me");
  // console.log("getAuthUser response", res);
  return { user: res.data.user };

};

export const login = async (userData) => {
  const response = await axiosInstance.post("auth/login", userData);
  // console.log("login response", response);
  return response.data ;
};



export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("auth/onboarding", userData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("auth/logout");
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
    // console.log("getUserFriends data", response.data);
  return response.data || [];
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data || [] ;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function translateText({ text, targetLanguage }) {
  const response = await axiosInstance.post("/translate/translate", {
    text,
    targetLanguage,
  });
  return response.data;
}

export async function searchUsers(query) {
  const response = await axiosInstance.get(`/users/search?query=${query}`);
  return response.data;
}
