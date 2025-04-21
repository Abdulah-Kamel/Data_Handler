import axios from "axios";

const baseUrl =
  (typeof process !== "undefined" && process.env.REACT_APP_API_URL) ||
  "https://ecommerce.routemisr.com";

export const authService = {
  forgotPassword: async (email) => {
    const response = await axios.post(
      `${baseUrl}/api/v1/auth/forgotPasswords`,
      { email }
    );
    return response.data;
  },
  verifyResetCode: async (resetCode) => {
    const response = await axios.post(
      `${baseUrl}/api/v1/auth/verifyResetCode`,
      { resetCode }
    );
    return response.data;
  },
};
