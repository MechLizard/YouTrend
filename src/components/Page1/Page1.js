import React, { useState } from 'react';
import {
  PageContainer,
  Header,
  Icon,
  PageTitle,
  PageDescription,
  FormContainer,
  Select,
  SubmitButton,
  TabImageAlt
} from '../GlobalStyles/Elements';

function Page1() {
  const [selection, setSelection] = useState({
    option1: '',
    option2: '',
    option3: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelection((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected options: ${selection.option1}, ${selection.option2}, ${selection.option3}`);
  };

  return (
    <PageContainer>
      {/* Logo and Navigation */}
      <Header>
        <Icon to="/home">YouTrend</Icon>
      </Header>

      {/* Page Title and Description */}
      <PageTitle>Page 1</PageTitle>
      <PageDescription>This page allows you to make selections from the drop-down menus.</PageDescription>

      {/* Form Section */}
      <FormContainer onSubmit={handleSubmit}>
        <Select name="option1" value={selection.option1} onChange={handleChange}>
          <option value="">Select Option 1</option>
          <option value="Option 1A">Option 1A</option>
          <option value="Option 1B">Option 1B</option>
          <option value="Option 1C">Option 1C</option>
        </Select>

        <Select name="option2" value={selection.option2} onChange={handleChange}>
          <option value="">Select Option 2</option>
          <option value="Option 2A">Option 2A</option>
          <option value="Option 2B">Option 2B</option>
          <option value="Option 2C">Option 2C</option>
        </Select>

        <Select name="option3" value={selection.option3} onChange={handleChange}>
          <option value="">Select Option 3</option>
          <option value="Option 3A">Option 3A</option>
          <option value="Option 3B">Option 3B</option>
          <option value="Option 3C">Option 3C</option>
        </Select>

        <SubmitButton type="submit">Submit</SubmitButton>
        
        {/* Image Section */}
        <TabImageAlt src="/images/tab1.jpg" alt="Tab 1 Image" />

      </FormContainer>


    </PageContainer>
  );
}

export default Page1;
