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


function Page1() {
  const [selection, setSelection] = useState({
    country: '',
    categoryId: '',
    startDate: '14-11-17',
    endDate: '14-06-18',
    tag: '',
    metric: 'views', // Default metric to display
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
      [name]: name === 'categoryId' ? Number(value) : value // Convert categoryId to a number
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
    const response = await axios.get(`http://localhost:5000/api/time-date-success?${queryParams}`);

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

const groupByDayOfWeek = (data, metricIndex, labels) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const groupedData = daysOfWeek.map(() => Array(labels.length).fill(0)); // Initialize with zeros

  data.forEach(row => {
    const date = formatDate(row[0]); // Format the date to match labels
    const dayIndex = new Date(row[0]).getDay(); // Get day index (0 = Sunday, 6 = Saturday)
    const labelIndex = labels.indexOf(date); // Find the formatted date in labels

    if (labelIndex !== -1) {
      groupedData[dayIndex][labelIndex] = row[metricIndex]; // Assign metric value to the correct day and date
    }
  });

  return groupedData;
};

const prepareBarChartData = (data, metric) => {
  const labels = generateLabels(data); // Generate sorted, unique dates for the X-axis
  const metricIndex = { views: 2, likes: 3, dislikes: 4, comments: 5 }[metric];
  const groupedData = groupByDayOfWeek(data, metricIndex, labels);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const datasets = groupedData.map((dayData, index) => ({
    label: daysOfWeek[index],
    data: dayData,
    backgroundColor: [
      'rgba(255, 99, 180, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(250, 26, 38, 0.6)',
    ][index],
    borderColor: [
      'rgba(255, 99, 180, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(250, 26, 38, 0.8)',
    ][index],
    borderWidth: 1,
    custom: data.map((row) => ({
      topVideoTitle: row[7], // Assuming `top_video_title` is in column 7
      topVideoViews: row[8], // Assuming `top_video_views` is in column 8
    })),
  }));

  return { labels, datasets };
};


const barChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Bar Chart: Metric by Day of the Week',
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const dataset = context.dataset;
          const index = context.dataIndex;
          const customData = dataset.custom[index]; // Access custom data

          let label = `${dataset.label}: ${context.raw}`; // Default label
          if (customData) {
            label += `\nTop Video: ${customData.topVideoTitle} (${customData.topVideoViews} views)`;
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Dates',
      },
      stacked: true, // Enable stacked bars
    },
    y: {
      title: {
        display: true,
        text: 'Counts',
      },
      stacked: true, // Enable stacked bars
    },
  },
};



  return (
    <PageContainer>
      <Header>
        <Icon to="/home">YouTrend</Icon>
      </Header>

      <PageTitle>Time & Day</PageTitle>
      <PageDescription>
        Explore how the day and time of trending video uploads changed over time and if it impacts popularity.
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

        <Select name="metric" value={selection.metric} onChange={handleChange}>
          <option value="">Select Metric</option>
          {metrics.map((metric) => (
            <option key={metric} value={metric}>
              {metric}
            </option>
          ))}
        </Select>
        <SubmitButton type="submit">Submit</SubmitButton>
      </FormContainer>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
      {results.length > 0 ? (
        <Bar data={prepareBarChartData(results, selection.metric)} options={barChartOptions} />
      ) : (
        <p>No data available to display as a chart.</p>
      )}
    </div>


    </PageContainer>
  );
}

export default Page1;
