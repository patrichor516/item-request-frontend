import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Read_request_item from "./Pages/Officer/Read_request_item";
import Update_request_item from "./Pages/Officer/Update_request_item";
import Create_request_item from "./Pages/Officer/Create_request_item";
import Read_request_approve from "./Pages/Manager/Read_request_approve";
import History_request_approve from "./Pages/Manager/History_request_approve";
import Read_request_approve_finance from "./Pages/Finance/Read_request_approve_finance";
import Register from "./Pages/Register";
const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role");
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/request/read" 
        element={
          <ProtectedRoute allowedRoles={['officer']}>
            <Read_request_item />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/request/create" 
        element={
          <ProtectedRoute allowedRoles={['officer']}>
            <Create_request_item />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/request/update/:requestId" 
        element={
          <ProtectedRoute allowedRoles={['officer']}>
            <Update_request_item />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/history/request" 
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <History_request_approve />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/request/approve/read" 
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Read_request_approve />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/request/approve/read/finance" 
        element={
          <ProtectedRoute allowedRoles={['finance']}>
            <Read_request_approve_finance />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
