import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role'); 

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />; 
    }

    return children;
};

export default ProtectedRoute;
