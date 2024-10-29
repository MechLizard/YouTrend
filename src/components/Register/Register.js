import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BGContainer, Form, FormButton, FormContent, FormH1, FormInput, FormLabel, FormWrap,
    Icon, TextLink } from '../GlobalStyles/Elements'; // Import global styled components

function Register() {

  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    country_name: ''
  });

  // Update form state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/send', formData);
      if (response.status === 201) {
        alert("User created successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      alert("Error creating user");
    }
  };

  return (
      <BGContainer>
        <FormWrap>
          <Icon to="/">YouTrend</Icon>
          <FormContent>
              <Form onSubmit={handleSubmit}>
              <FormH1>Register</FormH1>
                  <FormLabel htmlFor='email'>Email</FormLabel>
                  <FormInput
                      type='email'
                      id='email'
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      required
                  />
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <FormInput
                      type='password'
                      id='password'
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                  />
                  <FormLabel htmlFor="country_name">Country</FormLabel>
                  <FormInput
                    type="text"
                    id="country_name"
                    name="country_name"
                    value={formData.country_name}
                    onChange={handleChange}
                    required
                  />
                  <FormButton type='submit'>Continue</FormButton>
                  <TextLink to="/register">CREATE AN ACCOUNT</TextLink>
              </Form>
          </FormContent>
      </FormWrap>
    </BGContainer>
  );
}

export default Register;
