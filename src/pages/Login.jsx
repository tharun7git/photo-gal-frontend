import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authService } from '../services/api';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = ({ setUser }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await authService.login(values);
      const userData = await authService.getCurrentUser();
      setUser(userData.data[0]);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
    setSubmitting(false);
  };
  
  return (
    <div className="auth-form">
      <h2>Login to Your Account</h2>
      {error && <div className="error-message">{error}</div>}
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field type="text" name="username" id="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" id="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;