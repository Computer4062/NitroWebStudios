import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api.jsx"

export default function UserGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserStatus = async () => {
      try {
        const res = await api.get("/api/accounts/check-auth", {
          withCredentials: true, // Sends cookies/session flags along with the request
        });

        const data = res.data;

        // 🚀 Check the boolean flag returned in your JSON body
        if (data && data.authenciated === true) {
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          // Boot them out if the response came back without a valid authenticated flag
          console.warn("[Guard] Access denied: User is not authenticated.");
          navigate("/login");
        }

      } catch (error) {
        if (error.response?.status === 401) {
          console.warn("[Guard] Unauthorized access attempt.");
        } else {
          console.error("[Guard Fault] Authentication check failed:", error);
        }
        navigate("/login");
      }
    };

    verifyUserStatus();
  }, [navigate]);

  // 1. Render a clean spinner/loading screen while the network request resolves
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Validating Credentials...</span>
        </div>
      </div>
    );
  }

  // 2. If validation passes completely, render the protected component content safely
  return isAuthenticated ? <>{children}</> : null;
}