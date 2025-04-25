import { useState, useEffect } from "react";
import templateService from "../../../../services/templateService";

export const useTemplates = (categoryId) => {
  const [templates, setTemplates] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("User"));
  const token = user.access;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch category with its templates in a single request
      const result = await templateService.getByCategoryId(token, categoryId);

      if (result.error) {
        setError(result.error);
      } else {
        setCategory(result.data);
        setTemplates(result.templates);
        setError(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [token, categoryId, refreshTrigger]);

  return {
    templates,
    category,
    loading,
    error,
    refreshTrigger,
    setRefreshTrigger
  };
};