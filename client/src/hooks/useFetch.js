import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function useFetch(url, auto = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (auto) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
