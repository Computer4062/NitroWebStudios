import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api.jsx"

const Login = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	// Check if user is already logged in
	useEffect(() => {
		const checkUserAuth = async() => {
		    setLoading(true); // 1. Start the spinner

			try{
				const response = await api.get("/api/accounts/check-auth", {
					withCredentials: true
				});

				// If we got here without a 401, the user is logged in
				navigate("/nws-dash/dashboard");

			} catch(error) {
				if (error.response?.status === 401) {
					// Not logged in — stay on the login page, this is expected
				} else {
					console.error(error.message);
				}
			} finally {
        	    setLoading(false); // 2. Stop the spinner (happens whether success or error)
            }
		}

		checkUserAuth();
	}, [navigate]);

    const [formData, setFormData] = useState({ username: '', password: '', code: '' });
    const [step, setStep] = useState(1); // Step 1: Login, Step 2: 2FA Code
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = step === 1 
            ? "/api/accounts/login-step-1" 
            : "/api/accounts/login-step-2";

        setLoading(true); // Start the spinner for this step's request

        try {
            const response = await api.post(endpoint, formData, {
                withCredentials: true
            });

            if (step === 1) {
                setStep(2); // Success! Now show the code input
                setError('');
            } else {
                window.location.href = "/dashboard"; // Fully logged in!
                return; // keep spinner on while we navigate away
            }
        } catch (err) {
            if (err.response) {
                // Server responded with an error status (login/code failure)
                alert(err.response.data?.message || "Authentication failed. Restarting...");
                window.location.reload();
                return; // keep spinner on while we reload
            } else {
                // No response at all — network/connection issue
                setError("Server connection failed");
            }
        } finally {
            setLoading(false); // Stop spinner (unless we returned early above)
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center py-4 bg-body-tertiary vw-100 vh-100">
            <main className="form-signin m-auto" style={{ width: '300px' }}>
                <form onSubmit={handleSubmit}>
                    <img className="mb-4" src="../../public/icon.png" alt="" width="72" height="57" />
                    <h1 className="h3 mb-3 fw-normal">
                        {step === 1 ? "Please sign in" : "Enter Verification Code"}
                    </h1>

                    {/* STEP 1 FIELDS: Username and Password */}
                    {step === 1 && (
                        <>
                            <div className="form-floating pb-1">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="username"
                                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                    required
                                />
                                <label>username</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Password"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    required
                                />
                                <label>Password</label>
                            </div>
                        </>
                    )}

                    {/* STEP 2 FIELD: Verification Code (Otherwise Invisible) */}
                    {step === 2 && (
                        <div className="form-floating mb-3">
                            <input 
                                type="text" 
                                className="form-control border-primary shadow-sm" 
                                placeholder="000000"
                                onChange={(e) => setFormData({...formData, code: e.target.value})} 
                                autoFocus
                                required
                            />
                            <label>Verification Code</label>
                            <div className="form-text">Check your email for a 6-digit code.</div>
                        </div>
                    )}

                    <button className="btn btn-primary w-100 py-2 fw-bold" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {step === 1 ? "Sending Code..." : "Verifying..."}
                            </>
                        ) : (
                            step === 1 ? "Sign in" : "Verify & Login"
                        )}
                    </button>
                    
                    <hr />
                    <p className="mb-3 text-body-secondary text-center">Powered by NitroWeb Studios</p>
                </form>
            </main>
        </div>
    );
};

export default Login;