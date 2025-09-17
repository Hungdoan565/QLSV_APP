import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthUtils from '../../utils/authUtils';
import DirectAPITest from '../../components/Debug/DirectAPITest';

const AuthTestPage = () => {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await login(loginForm.email, loginForm.password);
      setMessage(`Login: ${result.success ? 'Success' : 'Failed'} - ${result.message}`);
    } catch (error) {
      setMessage(`Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await register(registerForm);
      setMessage(`Register: ${result.success ? 'Success' : 'Failed'} - ${result.message}`);
    } catch (error) {
      setMessage(`Register Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setMessage('Logged out successfully');
    } catch (error) {
      setMessage(`Logout Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Authentication System Test</h1>
        
        {/* Current User Status */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">Current User Status</h3>
          {isAuthenticated() ? (
            <div className="space-y-2">
              <p><strong>Authenticated:</strong> Yes</p>
              <p><strong>Name:</strong> {AuthUtils.getDisplayName(user)}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {AuthUtils.getRoleLabel(user?.role)}</p>
              <p><strong>Status:</strong> {AuthUtils.getStatusLabel(user?.account_status)}</p>
              <p><strong>Dashboard Path:</strong> {AuthUtils.getDashboardPath(user)}</p>
              <button 
                onClick={handleLogout}
                disabled={loading}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <p><strong>Authenticated:</strong> No</p>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-4 ${
            message.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Test Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="test@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password:</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="password"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Test Login'}
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Test Register</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({...prev, email: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="newuser@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password:</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({...prev, password: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password123"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name:</label>
                  <input
                    type="text"
                    value={registerForm.first_name}
                    onChange={(e) => setRegisterForm(prev => ({...prev, first_name: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nguyễn"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name:</label>
                  <input
                    type="text"
                    value={registerForm.last_name}
                    onChange={(e) => setRegisterForm(prev => ({...prev, last_name: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Văn A"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role:</label>
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm(prev => ({...prev, role: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Test Register'}
              </button>
            </form>
          </div>
        </div>

        {/* API Endpoints Test */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">API Status</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Backend:</strong> http://localhost:8000</p>
            <p><strong>Frontend:</strong> http://localhost:3001</p>
            <p><strong>API Base:</strong> http://localhost:8000/api</p>
            <div className="mt-4">
              <p><strong>Available Endpoints:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>POST /api/auth/register/</li>
                <li>POST /api/auth/login/</li>
                <li>POST /api/auth/logout/</li>
                <li>GET /api/auth/profile/</li>
                <li>POST /api/auth/token/refresh/</li>
                <li>GET /api/auth/health/</li>
              </ul>
            </div>
          </div>        </div>

        {/* Direct API Testing */}
        <DirectAPITest />
      </div>
    </div>
  );
};

export default AuthTestPage;
