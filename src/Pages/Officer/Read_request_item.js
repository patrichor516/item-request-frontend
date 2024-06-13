import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import Navbar from "../../element/Navbar";
import Footer from "../../element/Footer";

function Read_request_item() {
  const navigate = useNavigate();
  const [itemRequests, setItemRequests] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/list/request');
        const pendingRequests = response.data.filter(request => request.status === 'pending');
        setItemRequests(pendingRequests);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchDataUsers();
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/auth/delete/request/${id}`);
          Swal.fire('Deleted!', 'The item has been deleted.', 'success');
          setItemRequests(itemRequests.filter((request) => request.id !== id));
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete the item.', 'error');
          console.error('Failed to delete item:', error);
        }
      }
    });
  };

  const getUserName = (userId) => {
    const user = allUsers.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="wrapper">
      <Navbar />
      <div className="toolbar py-5 py-lg-15" id="kt_toolbar">
        <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
          <h3 className="text-white fw-bolder fs-2qx me-5">Welcome : {role} {name.name} </h3>
        </div>
      </div>

      <div className="content flex-row-fluid" id="kt_content">
        <div className="card card-page">
          <div className="card-body">
            <section className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">LIST REQUEST</h3>
                        <div className="card-tools">
                          <div className="input-group input-group-sm" style={{ width: '100px' }}>
                            <td>
                              <Link to="/request/create" className="btn btn-block btn-primary">
                                CREATE
                              </Link>
                            </td>
                          </div>
                        </div>
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
                                    <div className="btn-group">
                                      <button type="button" className="btn btn-info">Action</button>
                                      <button type="button" className="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                        <span className="sr-only">Toggle Dropdown</span>
                                      </button>
                                      <div className="dropdown-menu" role="menu">
                                        <Link className="dropdown-item" to={`/request/update/${request.id}`}>
                                          Edit
                                        </Link>
                                        <button className="dropdown-item" onClick={() => handleDelete(request.id)}>
                                          Delete
                                        </button>
                                      </div>
                                    </div>
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
      </div>
      <Footer />
    </div>
  );
}

export default Read_request_item;
