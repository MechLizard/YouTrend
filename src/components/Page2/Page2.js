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

function Page2() {
  const [selection, setSelection] = useState({
    country: '',
    categoryId: '',
    startDate: '14-11-17',
    endDate: '14-06-18',
    tag: '',
    comments_disabled: 'True', // Default value
    ratings_disabled: 'True',  // Default value
    video_removed: 'False',     // Default value
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
    const response = await axios.get(`http://localhost:5000/api/disabled-videos?${queryParams}`);
    console.log(`http://localhost:5000/api/disabled-videos?${queryParams}`);

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

const prepareDisabledBarChartData = (data) => {
  const labels = data.map(row => formatDate(row[0])); // Assuming trending_date is in column 0

  // Extract counts for the selected filters
  const commentsDisabledData = data.map(row => row[1] || 0); // comments_disabled_count
  const ratingsDisabledData = data.map(row => row[2] || 0); // ratings_disabled_count
  //const videoRemovedData = data.map(row => row[3] || 0); // video_removed_count

  // Prepare datasets
  const datasets = [
    {
      label: 'Comments Disabled',
      data: commentsDisabledData,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: 'Ratings Disabled',
      data: ratingsDisabledData,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
    // {
    //   label: 'Videos Removed',
    //   data: videoRemovedData,
    //   backgroundColor: 'rgba(255, 206, 86, 0.6)',
    //   borderColor: 'rgba(255, 206, 86, 1)',
    //   borderWidth: 1,
    // },
  ];

  return { labels, datasets };
};

const barChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Disabled Videos Analysis',
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        afterLabel: function (context) {
          const index = context.dataIndex; // Current data point index
          const row = results[index]; // Access the corresponding row
          const topVideoTitle = row ? row[4] : null; // Assuming top_video_title is in column 4
          const topVideoViews = row ? row[5] : null; // Assuming top_video_views is in column 5
    
          return topVideoTitle
            ? `Top Video: ${topVideoTitle}\nViews: ${topVideoViews}`
            : 'No top video data available.';
        },
      },
    }    
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Trending Date',
      },
      stacked: true, // Stacks the bars
    },
    y: {
      title: {
        display: true,
        text: 'Counts',
      },
      stacked: true, // Stacks the bars
    },
  },
};



  return (
    <PageContainer>
      <Header>
        <Icon to="/home">YouTrend</Icon>
      </Header>

      <PageTitle>Disabled Metrics</PageTitle>
      <PageDescription>
        Explore how keywords, tags, and categories most associated with disabled comments or ratings changed over time.
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

        {/* Dropdown for comments_disabled */}
        <Select name="comments_disabled" value={selection.comments_disabled} onChange={handleChange}>
          <option value="False">Comments Enabled</option>
          <option value="True">Comments Disabled</option>
        </Select>

        {/* Dropdown for ratings_disabled */}
        <Select name="ratings_disabled" value={selection.ratings_disabled} onChange={handleChange}>
          <option value="False">Ratings Enabled</option>
          <option value="True">Ratings Disabled</option>
        </Select>

        {/* Dropdown for video_removed */}
        {/* <Select name="video_removed" value={selection.video_removed} onChange={handleChange}>
          <option value="False">Video Not Removed</option>
          <option value="True">Video Removed</option>
        </Select> */}

        <SubmitButton type="submit">Submit</SubmitButton>
      </FormContainer>


      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
      {results.length > 0 ? (
        <Bar
        data={prepareDisabledBarChartData(results)}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Disabled Videos Analysis',
            },
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                afterLabel: function (context) {
                  // Access the current data point's index
                  const index = context.dataIndex;
      
                  // Get the corresponding row from results
                  const row = results[index];
      
                  // Safely access top video data
                  const topVideoTitle = row ? row[4] : 'No Title';
                  const topVideoViews = row ? row[5] : 0;
      
                  // Return the tooltip text
                  return topVideoTitle !== 'No Title'
                    ? `Top Video: ${topVideoTitle}\nViews: ${topVideoViews}`
                    : 'No top video data available.';
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Trending Date',
              },
              stacked: true,
            },
            y: {
              title: {
                display: true,
                text: 'Counts',
              },
              stacked: true,
            },
          },
        }}
      />      
      ) : (
        <p>No data available to display as a chart.</p>
      )}
    </div>


    </PageContainer>
  );
}

export default Page2;
