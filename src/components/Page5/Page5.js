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

// Import/ Register annotations
import annotationPlugin from 'chartjs-plugin-annotation';
ChartJS.register(annotationPlugin);

function Page5() {
  const [selection, setSelection] = useState({
    country: '',
    category_id: '',
    start_date: '14-11-17',
    end_date: '14-06-18',
    tag: ''
  });
  
  const [results, setResults] = useState([]); // State for query results
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, event: null });


  const countries = ['US', 'GB', 'FRANCE', 'CANADA'];
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

  const events = [
    { name: "Logan Paul - Suicide forest video upload", description: "Large YouTuber, Logan Paul, uploads a video of his team filming a suicide victim in a series of culturally insensitive videos, creating a large amount of drama and concern about what kids are watching.", date: "2017-12-31" },
    { name: "Winter Olympics Starts", description: "2018 winter Olympics starts on February 9th and ends on February 25th.", date: "2018-02-09" },
    { name: "Facebook-Cambridge Analytica Scandal", description: "This privacy breach raised public awareness about data security and social media ethics, leading many creators to produce videos explaining the scandal, discussing its implications, or offering privacy tips for viewers.", date: "2018-03-17" },
    { name: "Avicii’s Death", description: "The sudden death of Swedish DJ Avicii led to an outpouring of tribute videos, remixes, and analyses of his career and the pressures of fame in the music industry.", date: "2018-04-20" },
    { name: "Black Panther Released", description: "The release of Black Panther became a cultural phenomenon. Movie reviewers, fans, and commentators posted reactions.", date: "2018-02-16" },
    { name: "FIFA World Cup 2018", description: "2018 FIFA World Cup kicks off in Luzhniki Stadium in Moscow.", date: "2018-06-14" },
    { name: "E3 2018", description: "The Electronic Entertainment Expo (E3) 2018 showcased major game reveals like Cyberpunk 2077 and Super Smash Bros. Ultimate.", date: "2018-07-12" },
    { name: "U.S. Federal Government Shutdown", description: "The United States federal government shut down for two days until January 22nd after failing to pass legislation to fund government operations.", date: "2018-01-20" },
    { name: "Zero-Tolerance immigration policy announced", description: "US Attorney General Jeff Sessions announced a new 'zero-tolerance' policy intended to ramp-up criminal prosecution of people caught entering the United States illegally.", date: "2018-04-16" },
    { name: "Trump-Kim Jong Un Summit", description: "Trump met with North Korean leader Kim Jong-un in Singapore.", date: "2018-06-12" },
    { name: "Announcement of KSI vs. Logan Paul Boxing Match", description: "The announcement of a white-collar amateur crossover boxing match between English influencer KSI and American influencer Logan Paul.", date: "2018-03-18" },
    { name: "KSI vs. Logan Paul Boxing Match", description: "A white-collar amateur crossover boxing match between English influencer KSI and American influencer Logan Paul.", date: "2018-08-26" },
    { name: "Hawaii false missile alert", description: "An alert was accidentally issued over television, radio, and cell phones in Hawaii, instructing citizens to seek shelter due to an incoming ballistic missile.", date: "2018-01-14" },
    { name: "Royal Wedding", description: "A globally publicized wedding between Prince Harry and Meghan Markle.", date: "2018-05-19" },
    { name: "Star Wars: The Last Jedi Released", description: "Divisive reception of The Last Jedi sparked heated debates among fans, leading to an explosion of reviews, analysis, theory breakdowns, and reaction videos.", date: "2017-12-10" },
    { name: "Avengers: Infinity War Released", description: "The long-awaited finale of the Avengers series is released and breaks records.", date: "2018-04-28" },
    { name: "Getting Over It released", description: "A frustrating game about getting to the top of a mountain. Becomes a popular game played by streamers because of the streamer's extreme reaction to its frustrating elements.", date: "2017-12-06" }
];
  

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
    console.log(`Query string: ${queryParams}`);

    // Make the GET request using axios
    const response = await axios.get(`http://localhost:5000/api/trending-data?${queryParams}`);

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

const prepareBarChartData = (data, metric) => {
  const labels = generateLabels(data); // Generate sorted, unique dates for the X-axis
  const metricIndex = { views: 1, likes: 2, dislikes: 3, comments: 4 }; // Adjust indices to match your data structure

  if (!metric || !metricIndex[metric]) {
    return {
      labels,
      datasets: [], // No dataset if the metric is invalid or not selected
    };
  }

  return {
    labels,
    datasets: [
      {
        label: metric.charAt(0).toUpperCase() + metric.slice(1), // Capitalize metric name
        data: data.map((row) => row[metricIndex[metric]]), // Extract metric data
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
        borderColor: 'rgba(75, 192, 192, 1)', // Border color
        borderWidth: 1,
        custom: data.map((row) => ({
          topVideoTitle: row[6], // Assuming `top_video_title` is in column 7
          topVideoViews: row[7], // Assuming `top_video_views` is in column 8
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
      text: 'Bar Chart: Metric over Time',
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = `${context.dataset.label}: ${context.raw}`;
          const customData = context.dataset.custom[context.dataIndex];
          const topVideoInfo = customData
            ? `\nTop Video: ${customData.topVideoTitle} (${customData.topVideoViews} views)`
            : '';
          return `${label}${topVideoInfo}`;
        },
      },
    },
    annotation: {
      annotations: events.map((event) => ({
        type: 'line',
        mode: 'vertical',
        scaleID: 'x',
        value: event.date,
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
        label: {
          content: event.name,
          enabled: true,
          rotation: 90,
          position: 'top',
          color: 'black',
        },
        enter: (context) => {
          const chartArea = context.chart.chartArea;
          setPopup({
            visible: true,
            x: chartArea.left + context.element.x,
            y: chartArea.top,
            event,
          });
        },
        leave: () => {
          setPopup({ visible: false, x: 0, y: 0, event: null });
        },
      })),
    },    
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Dates',
      },
    },
    y: {
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

      <PageTitle>Events</PageTitle>
      <PageDescription>
        Explore how certain real world events affected the volume of views/comments/ratings count over time.
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
        {results.length > 0 && selection.metric ? (
          <Bar data={prepareBarChartData(results, selection.metric)} options={barChartOptions} />
        ) : (
          <p>No data available to display as a chart.</p>
        )}
      </div>
      {popup.visible && (
        <div
          style={{
            position: 'absolute',
            left: `800px`,
            top: `300px`, // Adjust the Y offset to place it above the annotation
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <h4>{popup.event.name}</h4>
          <p>{popup.event.description}</p>
          <p><strong>Date:</strong> {popup.event.date}</p>
        </div>
      )}
    </PageContainer>
  );
}

export default Page5;
