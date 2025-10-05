import React, { useState, useEffect } from 'react';
import { setupDatabase, checkDatabaseSetup } from '../utils/setupDatabase';
import { Building2, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const Setup = () => {
  const [setupStatus, setSetupStatus] = useState('checking');
  const [setupProgress, setSetupProgress] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const status = await checkDatabaseSetup();
      if (status.hasAdmins && status.hasProperties) {
        setSetupStatus('complete');
        setIsComplete(true);
      } else {
        setSetupStatus('incomplete');
      }
    } catch (error) {
      console.error('Error checking setup:', error);
      setSetupStatus('error');
    }
  };

  const runSetup = async () => {
    setSetupStatus('running');
    setSetupProgress('Creating admin user...');
    
    try {
      const success = await setupDatabase();
      if (success) {
        setSetupStatus('complete');
        setIsComplete(true);
        setSetupProgress('Database setup completed successfully!');
      } else {
        setSetupStatus('error');
        setSetupProgress('Setup failed. Please try again.');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setSetupStatus('error');
      setSetupProgress('Setup failed. Please check console for details.');
    }
  };

  if (setupStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking database setup...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h1>
          <p className="text-gray-600 mb-6">
            Your Firebase database is ready. You can now access the admin panel.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p><strong>Admin Email:</strong> admin@realestate.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Database Setup</h1>
          <p className="text-gray-600">
            Set up your Firebase database with sample data and admin user.
          </p>
        </div>

        {setupStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Setup Failed</h3>
                <p className="text-sm text-red-600 mt-1">{setupProgress}</p>
              </div>
            </div>
          </div>
        )}

        {setupStatus === 'running' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex">
              <Loader className="h-5 w-5 text-blue-400 mr-2 animate-spin" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Setting up database...</h3>
                <p className="text-sm text-blue-600 mt-1">{setupProgress}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">What will be created:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Admin user account
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Sample properties
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Database structure
            </li>
          </ul>
        </div>

        <button
          onClick={runSetup}
          disabled={setupStatus === 'running'}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {setupStatus === 'running' ? 'Setting up...' : 'Setup Database'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This will create sample data in your Firebase project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Setup;
