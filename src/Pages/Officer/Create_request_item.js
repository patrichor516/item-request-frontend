import React, { useState, useEffect } from "react";

import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import Navbar from "../../element/Navbar";
import Footer from "../../element/Footer";

function Create_request_item() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const fetchDataUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/list');
      const data = response.data.data;
      setAllUsers(data);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data:', error);
    }
  }

  useEffect(() => {
    fetchDataUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/create/request", {
        user_id: userId,
        item_name: itemName,
        quantity: quantity,
        status: status,
      });

      setMessage(response.data.message);
      navigate('/request/read');
      Swal.fire({
        title: 'Success',
        icon: 'success'
      });
    } catch (error) {
      setMessage("Failed to create request. Please try again.");
    }
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper">
        <Navbar />
        <div className="content-wrapper">
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Create Request Item</h5>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="userId" className="form-label">User ID</label>
                          <select
                            id="userId"
                            className="form-control"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                          >
                            <option value="">Pilih User</option>
                            {allUsers.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="itemName" className="form-label">Item Name</label>
                          <input type="text" className="form-control" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="quantity" className="form-label">Quantity</label>
                          <input type="number" className="form-control" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                        </div>
                    
                        <button type="submit" className="btn btn-primary">Submit</button>
                      </form>
                      {message && <div className="mt-3 alert alert-success">{message}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Create_request_item;
