import React, { useState, useEffect } from 'react';
import { Client, Account } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('6729b7ff003370efe21b'); // Replace with your project ID

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For Signup
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup forms
  const navigate = useNavigate();
  const account = new Account(client);

  // Check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get(); // Try to fetch the user session
        setIsLoggedIn(true); // If session exists, set logged in state
      } catch (err) {
        setIsLoggedIn(false); // If no session, the user is not logged in
      }
    };

    checkSession();
  }, []);

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Create session using email and password
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created:', session);

      // Clear the input fields after successful login
      setEmail('');
      setPassword('');
      setIsLoggedIn(true); // Mark as logged in

      // Redirect to the welcome page after successful login
      navigate('/Welcome');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  // Function to handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Create user using email and password
      const user = await account.create('unique()', email, password);
      console.log('User created:', user);

      // Automatically log the user in after successful signup
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created:', session);

      // Clear the input fields after successful signup
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsLoggedIn(true); // Mark as logged in

      // Redirect to the welcome page after successful signup
      navigate('/Welcome'); // Redirect to Welcome page
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please check your details and try again.');
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Delete the current session to log out
      await account.deleteSession('current');
      setIsLoggedIn(false); // Mark as logged out
      navigate('/'); // Redirect to the login page
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Clear fields when switching between forms
  const toggleForm = () => {
    setIsSignup(!isSignup);
    setError('');
    // Clear the fields when toggling between forms
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="logout-section">
          <h2>Welcome Back!</h2>
          <button onClick={handleLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          {isSignup ? (
            <form className="login-form" onSubmit={handleSignup}>
              <h2>Sign Up</h2>
              {error && <p className="error">{error}</p>}
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Sign Up</button>
              <p>
                Already have an account?{' '}
                <span onClick={toggleForm} className="toggle-link">
                  Login here
                </span>
              </p>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleLogin}>
              <h2>Sign In</h2>
              {error && <p className="error">{error}</p>}
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Sign In</button>
              <p>
                Don't have an account?{' '}
                <span onClick={toggleForm} className="toggle-link">
                  Sign Up here
                </span>
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
