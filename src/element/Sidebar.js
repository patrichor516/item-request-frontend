import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem('role');

    const fetchData = async () => {
        axios.defaults.headers.common['Authorization'] = token;
        try {
            const response = await axios.post('http://localhost:8000/api/auth/me');
            setName(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("access_token");
                navigate('/');
            }
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else {
            fetchData();
        }
    }, [token, navigate]);


    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className="nav-item nav-profile">
                    <a href="#" className="nav-link">
                        <div className="nav-profile-image">
                            <img src="../../assets/images/faces/face1.jpg" alt="profile" />
                            <span className="login-status online" />
                        </div>
                        <div className="nav-profile-text d-flex flex-column">
                            <span className="font-weight-bold mb-2">{name.name}</span>
                            <span className="text-secondary text-small">{role}</span>
                        </div>
                        <i className="mdi mdi-bookmark-check text-success nav-profile-badge" />
                    </a>
                </li>
                {role === 'officer' && (
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="collapse" href="#officer-menu" aria-expanded="false" aria-controls="officer-menu">
                            <span className="menu-title">Item Request</span>
                            <i className="menu-arrow" />
                        </a>
                        <div className="collapse" id="officer-menu">
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <Link to="/request/read" className="nav-link">
                                        <i className="far fa-circle nav-icon"></i>
                                        <p>
                                            Create Request
                                        </p>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/officer/create-request">Pengajuan Pembelian Barang</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                )}
                {role === 'manager' && (
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="collapse" href="#manager-menu" aria-expanded="false" aria-controls="manager-menu">
                            <span className="menu-title">Approve Pengajuan Barang Manager</span>
                            <i className="menu-arrow" />
                        </a>
                        <div className="collapse" id="manager-menu">
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <a className="nav-link" href="/request/approve/read">List Approve Pengajuan Barang</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/history/request">History Approve Pembelian Barang</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                )}
                {role === 'finance' && (
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="collapse" href="#finance-menu" aria-expanded="false" aria-controls="finance-menu">
                            <span className="menu-title">Pengajuan Barang Finance</span>
                            <i className="menu-arrow" />
                        </a>
                        <div className="collapse" id="finance-menu">
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <a className="nav-link" href="/request/approve/read/finance">List Approve Pengajuan Barang</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Sidebar;
