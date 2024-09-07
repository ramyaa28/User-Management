import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserForm from './UserForm';
import UserEditForm from './UserEditForm';
import './UserList.css';  // Import the CSS file

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
    }
  };

  const createUser = async (user) => {
    try {
      await axios.post('https://jsonplaceholder.typicode.com/users', user);
      fetchUsers();
      setShowForm(false);
    } catch (err) {
      setError('Failed to create user. Please try again.');
    }
  };

  const updateUser = async (user) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, user);
      fetchUsers();
      setShowEditForm(false);
    } catch (err) {
      setError('Failed to update user. Please try again.');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Users</h2>
        <button onClick={() => setShowForm(true)}>Create New User</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {showForm && <UserForm onSubmit={createUser} onClose={() => setShowForm(false)} />}
      {showEditForm && selectedUser && (
        <UserEditForm
          user={selectedUser}
          onSubmit={updateUser}
          onClose={() => setShowEditForm(false)}
        />
      )}
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id} className="user-list-item">
            <div className="user-info">
              <Link to={`/user/${user.id}`}>{user.name}</Link> ({user.email}, {user.phone})
            </div>
            <div className="action-buttons">
              <button className="edit-button" onClick={() => { setSelectedUser(user); setShowEditForm(true); }}>Edit</button>
              <button className="delete-button" onClick={() => deleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
