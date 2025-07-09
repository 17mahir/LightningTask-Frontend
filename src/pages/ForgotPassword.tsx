import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { forgotPassword, verifyOtp, resetPassword } from '../api/authApi';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

interface OtpFormData {
  otp: string;
}

interface ResetFormData {
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [resetToken, setResetToken] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpCountdown]);

  useEffect(() => {
    let resendTimer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      resendTimer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(resendTimer);
  }, [resendCooldown]);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordFormData>();

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormData>();

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    watch,
  } = useForm<ResetFormData>();

  const onEmailSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword(data);
      setMessage(response.data.message);
      setResetToken(response.data.resetToken);
      setEmail(data.email);
      setStep('otp');
      setOtpCountdown(300); // reset 5 minute timer
      setResendCooldown(60); // start resend cooldown
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    await onEmailSubmit({ email });
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await verifyOtp({ resetToken, otp: data.otp });
      setOtp(data.otp);
      setMessage(response.data.message);
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.error || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    setError('');
    setMessage('');

    if (data.newPassword !== data.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPassword({ resetToken, otp, newPassword: data.newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LightningTask ⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Verify OTP' : 'Reset Password'}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'email' && 'Enter your registered email to receive an OTP.'}
              {step === 'otp' && 'Enter the OTP sent to your email to verify.'}
              {step === 'reset' && 'Enter your new password below to complete the reset.'}
            </p>
          </div>

          {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">{message}</div>}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  {...registerEmail('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format',
                    },
                  })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {emailErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{emailErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  {...registerOtp('otp', {
                    required: 'OTP is required',
                    minLength: { value: 6, message: 'OTP must be 6 digits' },
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6-digit OTP"
                  disabled={isLoading}
                />
                {otpErrors.otp && <p className="text-sm text-red-600 mt-1">{otpErrors.otp.message}</p>}
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>OTP expires in: {formatTime(otpCountdown)}</span>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={resendCooldown > 0 || isLoading}
                  className={`ml-2 font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50`}
                >
                  Resend OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  {...registerReset('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 5, message: 'Minimum 6 characters required' },
                  })}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
                {resetErrors.newPassword && (
                  <p className="text-sm text-red-600 mt-1">{resetErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  {...registerReset('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === watch('newPassword') || 'Passwords do not match',
                  })}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Re-enter new password"
                  disabled={isLoading}
                />
                {resetErrors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
