import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import userService from '../../../services/userService';
import UsersTable from './UsersTable';
import UserModal from './UserModal';
import { useAuth } from '../../../Context/AuthContext';

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const { accessToken } = useAuth(); 

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await userService.getAllUsers(accessToken);
      if (data) {
        setUsers(data);
        setError(null);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [accessToken, refreshTrigger]);

  const handleUserUpdate = (updatedData) => {
    if (updatedData) {
      setUsers(updatedData);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleShowModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleModalSubmit = async (values) => {
    setModalLoading(true);
    try {
      if (modalMode === 'delete') {
        await onDelete(selectedUser);
      } else if (modalMode === 'edit') {
        await onEdit(selectedUser.id, values);
      }
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <PulseLoader color="#05755c" size={15} />
      </div>
    );
  }

  return (
    <div className="px-3 mt-5">
      <title>{t('users.page_title')}</title>
      <meta name="description" content={t('users.page_description')} />
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="m-0">{t('users.main_title')}</h2>
        <button
          className="btn d-flex align-items-center primary-btn-outline"
          onClick={() => handleShowModal('create')}
        >
          {t('users.add_new_button')}
          <i className="fas fa-plus me-2"></i>
        </button>
      </div>
      {error && (
        <div className="alert alert-danger text-center my-4">
          {t('users.errors.fetch')}
          <button
            className="btn btn-sm btn-outline-danger me-3"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
          >
            {t('users.retry_button')}
          </button>
        </div>
      )}

      {users.length === 0 && !loading ? (
        <div className="alert alert-info text-center">
          {t('users.no_users')}
        </div>
      ) : (
        <UsersTable
          users={users}
          loading={loading}
          onUpdate={handleUserUpdate}
          handleRefresh={handleRefresh}
          modalMode={modalMode}
          setShowModal={setShowModal}
          handleShowModal={handleShowModal}
          showModal={showModal}
          selectedUser={selectedUser}
        />
      )}
        <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mode={modalMode}
        user={selectedUser}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        handleRefresh={handleRefresh}
      />
    </div>
  );
};

export default Users;