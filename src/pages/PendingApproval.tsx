import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Mail, ArrowLeft } from 'lucide-react';

const PendingApproval: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Pending Approval</h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your account has been successfully created and is currently pending approval from an administrator. 
            You'll receive an email notification once your account is approved.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">Check your email for updates</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              This process usually takes 24-48 hours during business days.
            </p>
            
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{' '}
            <a href="mailto:support@LightningTask.com" className="text-blue-600 hover:text-blue-700">
              support@LightningTask.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;