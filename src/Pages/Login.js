import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [validation, setValidation] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            navigateBasedOnRole(localStorage.getItem('role'));
        }
    }, [navigate]);

    const loginHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('password', password);
        formData.append('role', role);

        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', formData);
            const { access_token, token_type, expires_in } = response.data;
            localStorage.setItem('access_token', `${token_type} ${access_token}`);
            localStorage.setItem('expires_at', new Date().getTime() + expires_in * 1000);
            localStorage.setItem('role', role);
            localStorage.setItem('name', name);

            navigateBasedOnRole(role);
        } catch (error) {
            setValidation(error.response.data.message);
        }
    };

    const navigateBasedOnRole = (role) => {
        switch (role) {
            case "manager":
                navigate('/request/approve/read');
                break;
            case "finance":
                navigate('/request/approve/read/finance');
                break;
            case "officer":
                navigate('/request/read');
                break;
            default:
                navigate('/Dashboard');
                break;
        }
    };

    return (
        <div className="container-scroller">
            <div className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
                <div className="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
                    <form className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework" onSubmit={loginHandler}>
                        <div className="text-center mb-10">
                            {/*begin::Title*/}
                            <h1 className="text-dark mb-3">
                                Login      </h1>
                            {/*end::Title*/}
                            {/*begin::Link*/}

                            {/*end::Link*/}
                        </div>
                        <div className="fv-row mb-10 fv-plugins-icon-container">
                        <label className="form-label fs-6 fw-bold text-dark">Username</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="name"
                                placeholder="Username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        
                        <div className="form-group row">
                            <div className="col-sm-4">
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="membershipRadios"
                                            id="membershipRadios1"
                                            value="officer"
                                            checked={role === "officer"}
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        Officer
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="membershipRadios"
                                            id="membershipRadios2"
                                            value="manager"
                                            checked={role === "manager"}
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        Manager
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="membershipRadios"
                                            id="membershipRadios3"
                                            value="finance"
                                            checked={role === "finance"}
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        Finance
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="fv-row mb-10 fv-plugins-icon-container">
                        <label className="form-label fs-6 fw-bold text-dark">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="d-flex flex-stack mb-2">
                                <label className="form-label fw-bold text-dark fs-6 mb-0"></label>
                                <a href="/register" className="link-primary fs-6 fw-bold">
                                    Register
                                </a>
                            </div>
                        <div className="text-center">
                            <button type="submit" id="kt_sign_in_submit" className="btn btn-lg btn-primary w-100 mb-5">
                                <span className="indicator-label">
                                    Next
                                </span>
                                <span className="indicator-progress">
                                    Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2" />
                                </span>
                            </button>
                        </div>
                        {validation && <div className="alert alert-danger mt-3">{validation}</div>}
                    </form>
                </div>
            </div>
        </div>

    );
}

export default Login;
