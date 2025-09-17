import React, { useState } from 'react';
import APIService from '../../services/apiService';
import AuthUtils from '../../utils/authUtils';

const DirectAPITest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/health/');
      const data = await response.json();
      
      addResult(
        'Health Check', 
        response.ok, 
        response.ok ? 'Backend API is healthy' : 'Backend API failed',
        data
      );
    } catch (error) {
      addResult('Health Check', false, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const result = await APIService.login('admin@test.com', 'Admin123456');
      
      addResult(
        'Login Test',
        result.success,
        result.success ? 'Login successful' : result.error?.message || 'Login failed',
        result.success ? result.data : result.error
      );
    } catch (error) {
      addResult('Login Test', false, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    const timestamp = Date.now();
    const testUser = {
      email: `newuser${timestamp}@test.com`,
      password: 'NewUser123456',
      first_name: 'New',
      last_name: 'User',
      role: 'student'
    };

    try {
      const result = await APIService.register(testUser);
      
      addResult(
        'Register Test',
        result.success,
        result.success ? 'Registration successful' : result.error?.message || 'Registration failed',
        result.success ? result.data : result.error
      );
    } catch (error) {
      addResult('Register Test', false, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testProfile = async () => {
    setLoading(true);
    try {
      const result = await APIService.getUserProfile();
      
      addResult(
        'Profile Test',
        !!result,
        result ? 'Profile fetched successfully' : 'Profile fetch failed',
        result
      );
    } catch (error) {
      addResult('Profile Test', false, `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Direct API Testing</h2>
      
      {/* Test Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={testHealthCheck}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Health Check
        </button>
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Login (Admin)
        </button>
        <button
          onClick={testRegister}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Register (New User)
        </button>
        <button
          onClick={testProfile}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Test Profile
        </button>
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-blue-600 mb-4">
          <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Running test...
          </div>
        </div>
      )}

      {/* Test Results */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Test Results:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500 italic">No tests run yet. Click a test button above.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-3 rounded border-l-4 ${
                  result.success 
                    ? 'bg-green-50 border-green-400 text-green-700' 
                    : 'bg-red-50 border-red-400 text-red-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{result.test}</h4>
                    <p className="text-sm">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                          Show response data
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{result.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h4 className="font-semibold mb-2">Available Test Accounts:</h4>
        <div className="text-sm space-y-1">
          <p><strong>Admin:</strong> admin@test.com / Admin123456</p>
          <p><strong>Teacher:</strong> teacher@test.com / Teacher123456</p>
          <p><strong>Student:</strong> student@test.com / Student123456</p>
        </div>
      </div>
    </div>
  );
};

export default DirectAPITest;
