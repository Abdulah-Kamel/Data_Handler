import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export const FilledtemplateService = {
  getAllTemplates: async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/templates/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error fetching templates:", error);
      return { data: null, error: "Failed to load templates" };
    }
  },
  createFilledTemplate: async (token, filledTemplateData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/filled_templates/create/`,
        filledTemplateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error creating filled template:", error?.response?.data);
      const errorMessage =
        error?.response?.data?.detail || "Failed to create filled template";
      return { data: null, error: errorMessage };
    }
  },
  getVariablesOfTemplate: async (token, templateId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/filled_templates/${templateId}/variables/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, 
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error fetching variables of template:", error);
      return { data: null, error: "Failed to load variables of template" };
    } 
  },
  createBulkFilledTemplates: async (token, bulkData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/filled_templates/bulk_generate/`,
        bulkData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      console.error("Error creating bulk filled templates:", error?.response?.data);
      const errorMessage =
        error?.response?.data?.detail || "Failed to create bulk filled templates";
      return { data: null, error: errorMessage };
    }
  }
};

export default FilledtemplateService;
