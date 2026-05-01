import React, { useState } from "react";
import { loginUser } from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";

const LoginComponent = ({ updateAuth }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);

        const loginData = {
            email: email.trim(),
            password: password.trim()
        };

        loginUser(loginData)
            .then((response) => {

                const data = response.data.data;

                localStorage.setItem("token", data.token);
                localStorage.setItem("email", data.email);
                localStorage.setItem("role", data.role);

                if (typeof updateAuth === "function") {
                    updateAuth();
                }

                navigate("/employees");
            })
            .catch((error) => {

                console.error("Login failed:", error);

                let msg = "Login failed. Please try again.";

                //  ApiResponse error
                if (error.response?.data?.message) {
                    msg = error.response.data.message;
                }

                // Plain string fallback
                else if (typeof error.response?.data === "string") {
                    msg = error.response.data;
                }

                // Network error
                else if (error.message) {
                    msg = error.message;
                }

                setPopupMessage(msg);
                setShowPopup(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">

                    <div className="card shadow p-4">

                        <h3 className="text-center mb-4">
                            Login
                        </h3>

                        <form onSubmit={handleLogin}>

                            {/* Email */}
                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            {/* Login Button */}
                            <div className="d-grid mb-2">
                                <button
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>

                            {/* Forgot Password */}
                            <div className="text-center">
                                <Link to="/forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>

                        </form>

                    </div>
                </div>
            </div>

            {/* Popup */}
            {showPopup && (
                <div className="popup-overlay">

                    <div className="popup-box">

                        <h4 className="text-danger mb-3">
                            Error
                        </h4>

                        <p>{String(popupMessage)}</p>

                        <button
                            className="btn btn-secondary mt-3"
                            onClick={() => setShowPopup(false)}
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default LoginComponent;