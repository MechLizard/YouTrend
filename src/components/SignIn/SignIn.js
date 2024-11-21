import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BGContainer, Form, FormButton, FormContent, FormH1, FormInput, FormLabel, FormWrap,
  Icon, TextLink
} from '../GlobalStyles/Elements'; // Import global styled components

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

      console.log('Response data:', response.data);

      if (response.data.success) {
        navigate('/home'); // Redirect to the home page on successful login
      } else {
        setError(response.data.message || 'Invalid login credentials');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError(err.response?.data?.message || 'An error occurred while trying to log in.');
    }
  };

  return (
    <BGContainer>
      <FormWrap>
        <Icon to="/">YouTrend</Icon>
        <FormContent>
          <Form onSubmit={handleLogin}>
            <FormH1>Login</FormH1>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <FormButton type="submit">Continue</FormButton>
            <TextLink to="/register">CREATE AN ACCOUNT</TextLink>
            <TextLink to="/home">TEMP HOME PAGE</TextLink>
          </Form>
        </FormContent>
      </FormWrap>
    </BGContainer>
  );
}

export default SignIn;
