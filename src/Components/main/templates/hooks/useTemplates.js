import {useEffect, useState} from "react";
import templateService from "../../../../services/templateService";
import {useAuth} from "../../../../Context/AuthContext";

export const useTemplates = (categoryId) => {
    const [templates, setTemplates] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const {user, accessToken} = useAuth();
    const fetchData = async () => {

        // Fetch category with its templates in a single request
        const result = await templateService.getByCategoryId(accessToken, categoryId);

        if (result.error) {
            setError(result.error);
        } else {
            setCategory(result.data);
            setTemplates(result.templates);
            setError(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!accessToken) return;
        setLoading(true);
        fetchData();
    }, [accessToken, categoryId]);
    useEffect(() => {
        if (!accessToken) return;
        fetchData();
    }, [refreshTrigger]);

    const handleSearch = async (searchTerm) => {
        setLoading(true);
        try {
            const result = await templateService.search(accessToken, searchTerm);
            if (result.error) {
                setError(result.error);
            } else {
                setTemplates(result.data);
                setError(null);
            }
        } catch (err) {
            setError("Failed to search templates");
        } finally {
            setLoading(false);
        }
    };

    return {
        templates,
        category,
        loading,
        error,
        refreshTrigger,
        setRefreshTrigger,
        handleSearch
    };
};