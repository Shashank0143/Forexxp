"use client"
import React from 'react';
import { FaTools } from 'react-icons/fa';

const BrokerDashboard = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-3">
      <FaTools className="display-3 text-primary mb-3" />
      <h1 className="h3 font-weight-bold text-dark mb-2">Broker Dashboard</h1>
      <p className="text-muted text-center">
        This page is currently under development. Check back soon for updates!
      </p>
    </div>
  );
};

export default BrokerDashboard;