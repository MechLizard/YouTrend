import React, { useState } from 'react';
import axios from 'axios';
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

// Register Chart.js components
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Page5() {
  const [selection, setSelection] = useState({
    country: '',
    category_id: '',
    start_date: '14-11-17',
    end_date: '14-06-18',
    tag: '',
  });
  
  const [results, setResults] = useState([]); // State for query results
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  const countries = ['US', 'Canada', 'UK', 'Australia'];
  const categoryMapping = {
    1: "Film & Animation",
    2: "Autos & Vehicles",
    10: "Music",
    15: "Pets & Animals",
    17: "Sports",
    18: "Short Movies",
    19: "Travel & Events",
    20: "Gaming",
    21: "Videoblogging",
    22: "People & Blogs",
    23: "Comedy",
    24: "Entertainment",
    25: "News & Politics",
    26: "Howto & Style",
    27: "Education",
    28: "Science & Technology",
    29: "Nonprofits & Activism",
    30: "Movies",
    31: "Anime/Animation",
    32: "Action/Adventure",
    33: "Classics",
    34: "Comedy",
    35: "Documentary",
    36: "Drama",
    37: "Family",
    38: "Foreign",
    39: "Horror",
    40: "Sci-Fi/Fantasy",
    41: "Thriller",
    42: "Shorts",
    43: "Shows",
    44: "Trailers"
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelection((prev) => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Construct query string for GET request
    const queryParams = new URLSearchParams(selection).toString();

    // Make the GET request using axios
    const response = await axios.get(`http://localhost:5000/api/popularity-data?${queryParams}`);

    // Handle the response
    if (response.status === 200) {
      console.log(response.data);
      setResults(response.data); // Save the results to state
    }
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    setError('An error occurred while fetching data.');
  } finally {
    setLoading(false);
  }
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-CA', options).format(new Date(date)); // 'YYYY-MM-DD'
};

  return (
    <PageContainer>
      <Header>
        <Icon to="/home">YouTrend</Icon>
      </Header>

      <PageTitle>P5</PageTitle>
      <PageDescription>
      Explore how the volume of views/comments/ratings count changed over time.
      </PageDescription>

      <FormContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          name="tag"
          value={selection.tag}
          onChange={handleChange}
          placeholder="Enter a tag (e.g., 'comedy', 'news')"
        />
        <Select name="category_id" value={selection.category_id} onChange={handleChange}>
          <option value="">Select Category</option>
          {Object.entries(categoryMapping).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
        <Select name="country" value={selection.country} onChange={handleChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>
        <Input
          type="text"
          name="start_date"
          value={selection.start_date}
          onChange={handleChange}
          placeholder="Enter Start Date (DD-MM-YY)"
        />
        <Input
          type="text"
          name="end_date"
          value={selection.end_date}
          onChange={handleChange}
          placeholder="Enter End Date (DD-MM-YY)"
        />

        <SubmitButton type="submit">Submit</SubmitButton>
      </FormContainer>


      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </PageContainer>
  );
}

export default Page5;
