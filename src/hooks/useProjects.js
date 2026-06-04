import { useState, useEffect } from "react";
import { getProjects } from "../config/firebase";
import { projectData as fallbackData } from "../data/projects";

/**
 * Hook to fetch projects from Firebase Firestore.
 * Falls back to the static data array if Firebase is unreachable.
 */
export function useProjects() {
  const [projects, setProjects] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        // If Firestore is empty, use static fallback
        setProjects(fallbackData);
      }
      setError(null);
    } catch (err) {
      console.warn("Firebase fetch failed, using static data:", err.message);
      setProjects(fallbackData);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: fetchProjects };
}
