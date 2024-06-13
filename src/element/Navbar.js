import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Navbar() {
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

  const handleLogout = async () => {
    axios.defaults.headers.common['Authorization'] = token;
    try {
      await axios.post('http://localhost:8000/api/auth/logout');
      localStorage.removeItem("access_token");
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="d-flex flex-column flex-root">
      <div className="page d-flex flex-row flex-column-fluid">
        <div className="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
          <div id="kt_header" className="header align-items-stretch" data-kt-sticky="true" data-kt-sticky-name="header" data-kt-sticky-offset="{default: '200px', lg: '300px'}">
            <div className="container-xxl d-flex align-items-center">
              <div className="d-flex align-items-center d-lg-none ms-n2 me-3" title="Show aside menu">
                <div className="btn btn-icon btn-custom w-30px h-30px w-md-40px h-md-40px" id="kt_header_menu_mobile_toggle">
                  <span className="svg-icon svg-icon-2x">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                      <path d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z" fill="black" />
                      <path opacity="0.3" d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z" fill="black" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="header-logo me-5 me-md-10 flex-grow-1 flex-lg-grow-0">
                <img alt="Logo" src="/assets/media/logos/logo-light.svg" className="h-15px h-lg-20px logo-default" />
                <img alt="Logo" src="/assets/media/logos/logo-default.svg" className="h-15px h-lg-20px logo-sticky" />
              </div>

              <div className="d-flex align-items-stretch justify-content-between flex-lg-grow-1">
                <div className="d-flex align-items-stretch" id="kt_header_nav">
                  <div className="header-menu align-items-stretch" data-kt-drawer="true" data-kt-drawer-name="header-menu" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="{default:'200px', '300px': '250px'}" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_header_menu_mobile_toggle" data-kt-swapper="true" data-kt-swapper-mode="prepend" data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav'}">
                    <div className="menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch" id="#kt_header_menu" data-kt-menu="true">

                      {role === 'officer' && (
                        <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-lg-1">
                          <span className="menu-link py-3">
                            <Link to="/request/read" className="menu-title">
                              REQUEST ITEM
                            </Link>
                          </span>
                        </div>
                      )}
                      {role === 'manager' && (
                        <>
                          <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-lg-1">
                            <span className="menu-link py-3">
                              <Link to="/request/approve/read" className="menu-title">
                                LIST REQUEST APPROVE
                              </Link>
                              <span className="menu-arrow d-lg-none" />
                            </span>
                          </div>
                          <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-lg-1">
                            <span className="menu-link py-3">
                              <Link to="/history/request" className="menu-title">
                                HISTORY REQUEST
                              </Link>
                              <span className="menu-arrow d-lg-none" />
                            </span>
                          </div>
                        </>
                      )}
                      {role === 'finance' && (
                        <div data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-placement="bottom-start" className="menu-item menu-lg-down-accordion me-lg-1">
                          <span className="menu-link py-3">
                            <Link to="/request/approve/read/finance" className="menu-title">
                              REQUEST FINANCE
                            </Link>
                            <span className="menu-arrow d-lg-none" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-stretch flex-shrink-0">
                  <div className="topbar d-flex align-items-stretch flex-shrink-0">
                    <div className="d-flex align-items-center ms-1 ms-lg-3">
                      <button onClick={handleLogout} className="btn btn-primary">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Other content */}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
