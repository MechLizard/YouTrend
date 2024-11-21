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

function Page4() {
  const [selection, setSelection] = useState({
    country: '',
    categoryId: '',
    startDate: '14-11-17',
    endDate: '14-06-18',
    tag: '',
  });
  
  const [chartData, setChartData] = useState(null);
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
      const rawData = response.data;
    
      const labels = rawData.map((item) => item.trending_date);
      const views = rawData.map((item) => item.views);
      const likes = rawData.map((item) => item.likes);
      const dislikes = rawData.map((item) => item.dislikes);
    
      setChartData({
        labels,
        datasets: [
          {
            label: 'Views',
            data: views,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Likes',
            data: likes,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
          {
            label: 'Dislikes',
            data: dislikes,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });
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

      <PageTitle>Popularity</PageTitle>
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
        <Select name="categoryId" value={selection.categoryId} onChange={handleChange}>
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
          name="startDate"
          value={selection.startDate}
          onChange={handleChange}
          placeholder="Enter Start Date (DD-MM-YY)"
        />
        <Input
          type="text"
          name="endDate"
          value={selection.endDate}
          onChange={handleChange}
          placeholder="Enter End Date (DD-MM-YY)"
        />

        <SubmitButton type="submit">Submit</SubmitButton>
      </FormContainer>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {chartData && (
      <div style={{ width: '80%', margin: 'auto' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Popularity Metrics Over Time',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Trending Date',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Count',
                },
              },
            },
          }}
        />
      </div>
    )}
    {!loading && results.length === 0 && <p>No data found for the given criteria.</p>}


    </PageContainer>
  );
}

export default Page4;
