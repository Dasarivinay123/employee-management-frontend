import React, { useState } from "react";
import { sendResetLink } from "../services/AuthService";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        sendResetLink(email)
            .then((response) => {

                //  ApiResponse success message
                alert(
                    response.data.message ||
                    "Reset link sent to your email"
                );
            })
            .catch((error) => {

                //  ApiResponse error message
                alert(
                    error.response?.data?.message ||
                    "Something went wrong"
                );
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">

                    <div className="card shadow p-4">
                        <h3 className="text-center mb-4">
                            Forgot Password
                        </h3>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                />
                            </div>

                            <div className="d-grid">
                                <button className="btn btn-primary">
                                    Send Link
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;