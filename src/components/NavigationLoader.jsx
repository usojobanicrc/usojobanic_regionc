// src/components/NavigationLoader.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RouteLoader from "./Loader";

export default function NavigationLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cada vez que cambia la ruta
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // controlás cuánto tiempo se muestra

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) return <RouteLoader />;

  return children;
}
