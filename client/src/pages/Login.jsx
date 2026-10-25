import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Demo 1-Click Fast Logins for Mentor / Evaluator
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      const user = await login(demoEmail, demoPassword);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed. Ensure database is seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3 shadow-sm">
                  <Hotel size={30} />
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">Welcome to HotelPro</h3>
                <p className="text-muted small">Sign in to manage your bookings or hotel operations</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-3">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      className="form-control bg-light border-start-0"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-muted mb-0">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className="form-control bg-light border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-hotelpro w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Evaluation Credentials */}
              <div className="mt-4 pt-4 border-top">
                <div className="small fw-bold text-muted text-center mb-3">
                  ⚡ 1-Click Mentor Evaluation Logins
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@hotelpro.com', 'admin123')}
                    className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center justify-content-center gap-2 py-2"
                  >
                    <ShieldCheck size={16} />
                    <span>Quick Login as Hotel Administrator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('guest@hotelpro.com', 'guest123')}
                    className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center justify-content-center gap-2 py-2"
                  >
                    <UserCheck size={16} />
                    <span>Quick Login as Registered Guest</span>
                  </button>
                </div>
              </div>

              {/* Footer link */}
              <div className="text-center text-muted small mt-4">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
