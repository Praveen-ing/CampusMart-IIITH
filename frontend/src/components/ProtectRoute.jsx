import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('user') !== null;
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectRoute;