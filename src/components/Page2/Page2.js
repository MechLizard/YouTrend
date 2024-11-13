import React, { useState } from 'react';
import {
  PageContainer,
  Header,
  Icon,
  PageTitle,
  PageDescription,
  FormContainer,
  FormContainer2,
  Select,
  SubmitButton,
  TabImageAlt,
  Input
} from '../GlobalStyles/Elements';

function Page2() {
  const [selection, setSelection] = useState({
    country: '',
    categoryId: '',
    startDate: '14-11-17',
    endDate: '14-06-18',
    tag: ''
  });

  // Sample options (replace with your actual values)
  const countries = ['USA', 'Canada', 'UK', 'Australia'];
  const categories = ['1', '2', '10', '15', '17', '20', '22']; // Example category IDs

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelection((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Format date inputs if needed
    const formattedStartDate = formatToOracleDate(selection.startDate);
    const formattedEndDate = formatToOracleDate(selection.endDate);

    // Construct query parameters
    const query = {
      country: selection.country || '%',
      categoryId: selection.categoryId || null,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      tag: selection.tag || '%'
    };

    alert(`Query Parameters: ${JSON.stringify(query)}`);
    // You can now use `query` to make a request to your Oracle database.
  };

  // Helper function to format date to 'DD-MM-YY'
  const formatToOracleDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year.slice(2)}`; // Convert 'YYYY-MM-DD' to 'DD-MM-YY'
  };

  return (
    <PageContainer>
      {/* Logo and Navigation */}
      <Header>
        <Icon to="/home">YouTrend</Icon>
      </Header>

      {/* Page Title and Description */}
      <PageTitle>Page 2</PageTitle>
      <PageDescription>Select your search criteria for trending videos.</PageDescription>

      {/* Form Section */}
      <FormContainer onSubmit={handleSubmit}>
        {/* Country Dropdown */}
        <Select name="country" value={selection.country} onChange={handleChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>

        {/* Category ID Dropdown */}
        <Select name="categoryId" value={selection.categoryId} onChange={handleChange}>
          <option value="">Select Category ID</option>
          {categories.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </Select>

        {/* Start Date Input */}
        <Input
          type="date"
          name="startDate"
          value={selection.startDate}
          onChange={handleChange}
          placeholder="Start Date"
        />

        {/* End Date Input */}
        <Input
          type="date"
          name="endDate"
          value={selection.endDate}
          onChange={handleChange}
          placeholder="End Date"
        />

        {/* Tag Input with Autocomplete (Basic Implementation) */}
        <Input
          type="text"
          name="tag"
          value={selection.tag}
          onChange={handleChange}
          placeholder="Enter a tag (e.g., 'comedy', 'news')"
        />


      </FormContainer>
      <FormContainer2>
        {/* Submit Button */}
        <SubmitButton type="submit">Submit</SubmitButton>

        {/* Image Section */}
        <TabImageAlt src="/images/tab2.jpg" alt="Tab 2 Image" />
      </FormContainer2>

    </PageContainer>
  );
}

export default Page2;
