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
    tag: ''
  });
  
  
  const [results, setResults] = useState([]); // State for query results
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  const countries = ['US', 'Canada', 'UK', 'Australia'];
  const metrics = ['views', 'comments', 'likes', 'dislikes'];
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
      [name]: name === 'categoryId' ? Number(value) : value
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
    const response = await axios.get(`http://localhost:5000/api/sentiment-data?${queryParams}`);

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

const generateLabels = (data) => {
  const dates = data.map(row => formatDate(row[0])); // Format all dates
  const uniqueDates = Array.from(new Set(dates)); // Remove duplicates
  uniqueDates.sort((a, b) => new Date(a) - new Date(b)); // Sort dates
  return uniqueDates; // Return formatted, sorted, unique dates
};

const prepareBarChartData = (data) => {
  const labels = generateLabels(data); // Generate sorted, unique dates for the X-axis

  return {
    labels,
    datasets: [
      {
        label: 'Views',
        data: data.map((row) => row[6]), 
        backgroundColor: 'rgba(255, 159, 64, 0.6)', // Bar color
        borderColor: 'rgba(255, 159, 64, 1)', // Border color
        borderWidth: 1,
        custom: data.map((row) => ({
          topVideoTitle: row[5], // Assuming top_video_title is in column 7
          topVideoViews: row[6], // Assuming top_video_views is in column 8
        })),
      },
      {
        label: 'Dislike/Like Ratio',
        data: data.map((row) => row[3] * 1000000), 
        backgroundColor: 'rgba(250, 26, 38, 0.6)', // Different bar color
        borderColor: 'rgba(250, 26, 38, 1)', // Different border color
        borderWidth: 1,
        custom: data.map((row) => ({
          topVideoTitle: row[5],
          topVideoViews: row[6],
        })),
      },
    ],
  };
};


const barChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Stacked Bar Chart: Metric and Top Video Views over Time',
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const { raw, datasetIndex, dataIndex } = context;
          const customData = context.chart.data.datasets[datasetIndex].custom[dataIndex];
          const title = customData?.topVideoTitle || 'N/A';
          const views = customData?.topVideoViews || 'N/A';

          return [
            `${context.dataset.label}: ${raw}`,
            `Top Video: ${title}`,
            `Views: ${views}`,
          ];
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true, // Enable stacking for the X-axis
      title: {
        display: true,
        text: 'Dates',
      },
    },
    y: {
      stacked: true, // Enable stacking for the Y-axis
      title: {
        display: true,
        text: 'Counts',
      },
    },
  },
};

  return (
    <PageContainer>
      <Header>
        <Icon to="/home">YouTrend</Icon>
      </Header>

      <PageTitle>Sentiment</PageTitle>
      <PageDescription>
        Explore how sentiment effects views and if it has changed over time.
      </PageDescription>
      <PageDescription>
        *Note higher dislike/like ratios will have a larger bar!
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
      <div>
      {results.length > 0 ? (
        <Bar data={prepareBarChartData(results)} options={barChartOptions} />
      ) : (
        <p>No data available to display as a chart.</p>
      )}
      </div>

    </PageContainer>
  );
}

export default Page4;
