import React, { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../../element/Navbar";
import Footer from "../../element/Footer";
import { useNavigate } from "react-router-dom";

function History_request_approve() {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState('');
  const [itemRequests, setItemRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
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

  const fetchDataUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/list');
      setAllUsers(response.data.data);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data:', error);
    }
  }


  useEffect(() => {
    if (!token) {
        navigate('/');
    } else {
        fetchData();
    }
}, [token, navigate]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/list/request');
        // Filter hanya data yang memiliki status 'pending'
        const pendingRequests = response.data.filter(request => request.status === 'approvedByManager');
        setItemRequests(pendingRequests);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };
    fetchDataUsers();
    fetchData();
  }, []);

  const getUserName = (userId) => {
    const user = allUsers.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="container-scroller">
      
        <Navbar />
        <div className="toolbar py-5 py-lg-15" id="kt_toolbar">
        {/*begin::Container*/}
        <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
          {/*begin::Title*/}
          <h3 className="text-white fw-bolder fs-2qx me-5">Welcome : {role} {name.name}</h3>
        </div>
      </div>
        <div className="main-panel">
          <div className="content-wrapper">
            <section className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        {loading ? (
                          <p>Loading data...</p>
                        ) : (
                          <table id="example1" className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>User ID</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            
                              </tr>
                            </thead>
                            <tbody>
                              {itemRequests.map((request) => (
                                <tr key={request.id}>
                                  <td>{request.id}</td>
                                  <td>{getUserName(request.user_id)}</td>
                                  <td>{request.item_name}</td>
                                  <td>{request.quantity}</td>
                                  <td>{request.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </div>
  );
}

export default History_request_approve;
