// LoginPage.tsx
import React, { useState } from 'react';
import { useUser } from './UserContext.tsx';
import { useNavigate, Link } from 'react-router-dom';
import '../Styling/LoginPage.css';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ name: data.name });
        navigate('/home');
        console.log('Login successful!', data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4">
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>
          <br />

          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <br />

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <button type="submit" className="button">
            Login
          </button>
        </form>

        <p className="mt-3">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
