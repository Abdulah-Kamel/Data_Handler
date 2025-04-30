import React, { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import userService from '../../../services/userService';
import UsersTable from './UsersTable';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("User"));
  const token = user.access;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await userService.getAllUsers(token);
      if (data) {
        setUsers(data);
        setError(null);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [token, refreshTrigger]);

  const handleUserUpdate = (updatedData) => {
    if (updatedData) {
      setUsers(updatedData);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };


  

  if (loading && users.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <PulseLoader color="#0aad0a" size={15} />
      </div>
    );
  }

  return (
    <div className="px-3 mt-5">
      <title>Data Handler - أداره المستخدمين</title>
      <meta name="description" content="Data Handler - أداره المستخدمين" />

      {error && (
        <div className="alert alert-danger text-center my-4">
          {error}
          <button
            className="btn btn-sm btn-outline-danger me-3"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {users.length === 0 && !loading ? (
        <div className="alert alert-info text-center">
          لا يوجد مستخدمين حالياً
        </div>
      ) : (
        <UsersTable
          users={users}
          loading={loading}
          onUpdate={handleUserUpdate}
          handleRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default Users;