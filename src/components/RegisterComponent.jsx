import React, { useState } from "react";
import { registerUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Frontend Validation
        if (name.trim() === "") {
            alert("Name is required");
            return;
        }

        const emailRegex =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(email)) {
            alert("Enter valid email address");
            return;
        }

        if (password.length < 6) {
            alert("Password must be minimum 6 characters");
            return;
        }

        const user = {
            name: name.trim(),
            email: email.trim(),
            password: password.trim()
        };

        setLoading(true);

        registerUser(user)
            .then((response) => {

                //  ApiResponse success message
                const msg =
                    response.data.message ||
                    "Registration successful! Check email for login.";

                alert(msg);

                navigate("/login");
            })
            .catch((error) => {

                console.error("Registration failed:", error);

                let msg = "Registration failed. Please try again.";

                //  ApiResponse backend error
                if (error.response?.data?.message) {
                    msg = error.response.data.message;
                }

                // Validation object fallback
                else if (typeof error.response?.data === "object") {
                    msg = Object.values(error.response.data).join(", ");
                }

                // Network error fallback
                else if (error.message) {
                    msg = error.message;
                }

                alert(msg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="d-flex justify-content-center pt-5">

            <div
                className="card shadow p-4"
                style={{ width: "350px" }}
            >

                <h3 className="text-center mb-4">
                    Register
                </h3>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Name"
                        className="form-control mb-3"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="form-control mb-3"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="form-control mb-3"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button
                        className="btn btn-success w-100"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

            </div>
        </div>
    );
};

export default RegisterComponent;