import axios from 'axios';

const API_URL = import.meta.env.VITE_CATCH_THE_THIEF_URL;

const excludedDomainsService = {
  getExcludedDomains: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/get_the_thief/excluded-domains/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch excluded domains' };
    }
  },

  addExcludedDomain: async (token, domain) => {
    try {
      const response = await axios.post(`${API_URL}/get_the_thief/excluded-domains/`, domain, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to add excluded domain' };
    }
  },

  deleteExcludedDomain: async (token, domainId) => {
    try {
      await axios.delete(`${API_URL}/get_the_thief/excluded-domains/${domainId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { error: null };
    } catch (error) {
      return { error: 'Failed to delete excluded domain' };
    }
  },
};

export default excludedDomainsService;
