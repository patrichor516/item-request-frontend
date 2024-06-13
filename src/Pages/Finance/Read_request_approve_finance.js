import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import Navbar from "../../element/Navbar";
import Footer from "../../element/Footer";
import { Dropdown, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Read_request_approve_finance() {
  const navigate = useNavigate();
  const [itemRequests, setItemRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [transferProof, setTransferProof] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
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
      console.error('Failed to fetch user data:', error);
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
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/list/request');
        const approvedRequests = response.data.filter(request => request.status === 'approvedByManager');
        setItemRequests(approvedRequests);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchDataUsers();
    fetchRequests();
  }, []);

  const handleFileChange = (event) => {
    setTransferProof(event.target.files[0]);
  };

  const handleApproveClick = (id) => {
    setSelectedRequestId(id);
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!transferProof) {
      Swal.fire('Error', 'Please upload transfer proof before approving', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('status', 'approvedByFinance');
    formData.append('transfer_proof', transferProof);

    try {
      const response = await axios.post(`http://localhost:8000/api/auth/approvals/${selectedRequestId}/approve`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setItemRequests(itemRequests.filter(request => request.id !== selectedRequestId));
      Swal.fire('Success', 'Item request has been approved', 'success');
      setShowModal(false);
      setTransferProof(null);
      setSelectedRequestId(null);
    } catch (error) {
      console.error('Failed to approve item request:', error);
      Swal.fire('Error', 'Failed to approve item request', 'error');
    }
  };

  const handleReject = async (id, reason) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/auth/approvals/${id}/approve`, {
        status: 'rejected',
        reason
      });
      console.log(response.data);
      setItemRequests(itemRequests.filter(request => request.id !== id));
      Swal.fire('Success', 'Item request has been rejected', 'success');
    } catch (error) {
      console.error('Failed to reject item request:', error);
      Swal.fire('Error', 'Failed to reject item request', 'error');
    }
  };

  const getUserName = (userId) => {
    const user = allUsers.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="toolbar py-5 py-lg-15" id="kt_toolbar">
        <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
          <h3 className="text-white fw-bolder fs-2qx me-5">Welcome : {role} {name.name} </h3>
        </div>
      </div>
      <div className="main-panel">
        <div className="content-wrapper">
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">LIST REQUEST</h3>
                    </div>
                    <div className="card-body">
                      {loading ? (
                        <p>Loading data...</p>
                      ) : (
                        <table id="example1" className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Item Name</th>
                              <th>Quantity</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemRequests.map((request) => (
                              <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{getUserName(request.user_id)}</td> {/* Mengganti user_id dengan nama pengguna */}
                                <td>{request.item_name}</td>
                                <td>{request.quantity}</td>
                                <td>{request.status}</td>
                                <td>
                                  <Dropdown>
                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                      Action
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                      <Dropdown.Item onClick={() => handleApproveClick(request.id)}>Approve</Dropdown.Item>
                                      <Dropdown.Item onClick={() => {
                                        const reason = prompt('Enter the reason for rejection:');
                                        if (reason) {
                                          handleReject(request.id, reason);
                                        }
                                      }}>
                                        Reject
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </td>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Transfer Proof</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Read_request_approve_finance;
