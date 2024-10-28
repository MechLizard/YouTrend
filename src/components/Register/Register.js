import React from 'react';
import { Link } from 'react-router-dom';
import { BGContainer, Form, FormButton, FormContent, FormH1, FormInput, FormLabel, FormWrap,
    Icon, TextLink } from '../GlobalStyles/Elements'; // Import global styled components

function Register() {
  return (
      <BGContainer>
        <FormWrap>
          <Icon to="/">YouTrend</Icon>
          <FormContent>
              <Form>
              <FormH1>Register</FormH1>
                  <FormLabel htmlFor='email'>Email</FormLabel>
                  <FormInput
                      type='email'
                      id='email'
                  />
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <FormInput
                      type='password'
                      id='password'
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
