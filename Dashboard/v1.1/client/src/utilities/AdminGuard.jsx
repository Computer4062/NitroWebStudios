import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminStatus = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/accounts/check-auth", {
          credentials: 'include', // Sends cookies/session flags along with the request
        });

        // If the server returns unauthorized directly
        if (res.status === 401) {
          console.warn("[Guard] Unauthorized access attempt.");
          navigate("/dashboard/items"); 
          return;
        }

        const data = await res.json();

        // 🚀 Check the boolean flag returned in your JSON body
        if (data && data.admin === true) {
          setIsAdmin(true);
          setIsLoading(false);
        } else {
          // Boot them out if they are authenticated but NOT an admin
          console.warn("[Guard] Access denied: User is not an admin.");
          navigate("/dashboard/items");
        }

      } catch (error) {
        console.error("[Guard Fault] Authentication check failed:", error);
        navigate("/dashboard/items");
      }
    };

    verifyAdminStatus();
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
  return isAdmin ? <>{children}</> : null;
}