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
      return { data: null, error: "خطأ فى جلب القوالب" };
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
      return { data: response, error: null };
    }catch (error) {
      const errorData = error?.response?.data;
      return { 
        data: null, 
        error: {
          message: errorData?.error || "خطأ في إنشاء المستند",
          details: errorData?.details || []
        }
      };
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
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: "خطأ في جلب المتغيرات" };
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
      return { data: response, error: null };
    } catch (error) {
      const errorData = error?.response?.data;
      return { 
        data: null, 
        error: {
          message: errorData?.error || "خطأ في إنشاء المستندات",
          details: errorData?.details || []
        }
      };
    }
  }
};

export default FilledtemplateService;
