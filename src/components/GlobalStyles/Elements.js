import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Container for the entire page
export const Container = styled.div`
    min-height: 692px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 0;
    overflow: hidden;
    background: white;
`
// Container for the entire page
export const BGContainer = styled.div`
    min-height: 692px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 0;
    overflow: hidden;
    background-image: url(${({ theme }) => theme.backgrounds.main});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`;

// Wrapper for the form section
export const FormWrap = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media screen and (max-width: 400px) {
        height: 80%;
    }
`

// Icon component at the top of the page
export const Icon = styled(Link)`
    margin-left: 32px;
    margin-top: 32px;
    text-decoration: none;
    color: black;
    font-weight: 800;
    font-size: 48px;

    @media screen and (max-width: 480px) {
        margin-left: 16px;
        margin-top: 8px;
    }
`

// Container for the form content
export const FormContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media screen and (max-width: 480px) {
        padding: 10px;
    }
`

// Form container with styles
export const Form = styled.form`
    background-color: ${({ theme }) => theme.colors.secondary};
    max-width: 400px;
    height: auto;
    width: 100%;
    z-index: 1;
    display: grid;
    margin: 0 auto;
    padding: 80px 32px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

    @media screen and (max-width: 400px) {
        padding: 32px 32px;
    }
`

// Header for the form
export const FormH1 = styled.h1`
    margin-bottom: 40px;
    color: #fff;
    font-size: px;
    font-weight: 400;
    text-align: center;
`

// Label for form inputs
export const FormLabel = styled.label`
    margin-bottom: 8px;
    font-size: 14px;
    color: #fff;
`

// Input fields for the form
export const FormInput = styled.input`
    padding: 16px 16px;
    margin-bottom: 32px;
    border: none;
    border-radius: 4px;
`

// Submit button for the form
export const FormButton = styled.button`
    background-color: ${({ theme }) => theme.colors.primary};
    padding: 16px 0;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
`

// Link for additional options
export const TextLink = styled(Link)`
    text-align: center;
    margin-top: 24px;
    color: #fff;
    font-size: 14px;
    text-decoration: none;

    &:hover {
        color: darkslategray;  // Change color on hover 
    }
`


// HOMEPAGE

// Home Page Container
export const HomeContainer = styled.div`
  padding: 40px;
  background-color: white;
  min-height: 100vh;
`;

// Header Section
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

// Page Title and Description
export const PageTitle = styled.h1`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

export const PageDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 20px;
`;

// Tabs Container
export const TabsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
`;

// Individual Tab Styles
export const Tab = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  color: #fff;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const TabTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

export const TabDescription = styled.p`
  font-size: 14px;
  margin-bottom: 10px;
`;

export const TabImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 10px;
`;

export const TabButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

// PAGES

// Page Container
export const PageContainer = styled.div`
  padding: 40px;
  background-color: white;
  min-height: 100vh;
`;

// Form Container (Aligned Horizontally)
export const FormContainer = styled.form`
  display: flex;
  flex-direction: row;   /* Align elements horizontally */
  gap: 20px;             /* Space between elements */
  margin: 20px 0;
  align-items: center;   /* Center align the elements vertically */
  justify-content: center; /* Center align the elements horizontally */
  flex-wrap: wrap;       /* Allow wrapping on smaller screens */
`;

// Form Container (Aligned Vertically)
export const FormContainer2 = styled.form`
  display: flex;
  flex-direction: column;   /* Align elements horizontally */
  gap: 20px;             /* Space between elements */
  margin: 20px 0;
  align-items: center;   /* Center align the elements vertically */
  justify-content: center; /* Center align the elements horizontally */
  flex-wrap: wrap;       /* Allow wrapping on smaller screens */
`;


// Select (Drop-Down Menu)
export const Select = styled.select`
  padding: 10px;
  width: 150px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  font-size: 16px;
`;

// Submit Button
export const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TabImageAlt = styled.img`
  width: 50%;
  height: 80%;        /* Set a fixed height */
  border-radius: 4px;
  justify-content: center;
`;

export const Input = styled.input`
  width: 150px;
  padding: 10px 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
  background-color: #f9f9f9;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  &::placeholder {
    color: #999;
  }
`;

export const MultiSelect = styled.select`
  padding: 10px;
  width: 200px;
  height: auto;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.accent};
  }

  option {
    padding: 10px;
    font-size: 14px;
  }
`;