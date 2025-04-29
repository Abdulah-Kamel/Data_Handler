import axios from "axios";

const baseUrl =
  import.meta.env.VITE_API_URL;

export const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${baseUrl}/auth/token/`, credentials);
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await axios.post(`${baseUrl}/auth/password-reset/`, {
      email,
    });
    return response;
  },
  resetPassword: async ( resetData) => {
    const response = await axios.post(
      `${baseUrl}/auth/password-reset-confirm/${resetData.token}/${resetData.uid}/`,
      {
        "password":resetData.password,
      }
    );
  },
};
