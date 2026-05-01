import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const ResetPassword = () => {

    const [password, setPassword] = useState("");
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const token = params.get("token");

    const handleSubmit = (e) => {
        e.preventDefault();

        API.post(
            `/api/auth/reset-password?token=${token}&password=${password.trim()}`
        )
            .then((response) => {

                //  ApiResponse success message
                alert(
                    response.data.message ||
                    "Password updated successfully"
                );

                navigate("/login");
            })
            .catch((error) => {

                //  ApiResponse error message
                alert(
                    error.response?.data?.message ||
                    "Invalid or expired link"
                );
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">

                    <div className="card shadow p-4">

                        <h3 className="text-center mb-4">
                            Reset Password
                        </h3>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="form-control"
                                />
                            </div>

                            <div className="d-grid">
                                <button className="btn btn-success">
                                    Update Password
                                </button>
                            </div>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResetPassword;