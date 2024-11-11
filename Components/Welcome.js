// src/components/Welcome.js
import React, { useEffect, useState } from 'react';
import { Client, Account } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import './Welcome.css'; // Import the CSS for styling

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('6729b7ff003370efe21b'); // Replace with your project ID

const Welcome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const account = new Account(client);

  useEffect(() => {
    // Fetch the current session (user info) on page load
    const fetchUser = async () => {
      try {
        const userData = await account.get(); // Get current user info
        setUser(userData); // Set user data to display the username
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };

    fetchUser();
  }, [account]);

  const handleLogout = async () => {
    try {
      // Log out the current session
      await account.deleteSession('current');
      console.log('Logged out successfully');
      navigate('/'); // Redirect to login page after logout
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="welcome-container">
      <h1>Welcome, {user ? user.name : 'Guest'}</h1> {/* Display user name if available */}
      {user && <p> {user.email}</p>} {/* Display user email */}
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Welcome;
