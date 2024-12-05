import React from 'react';
import {
  HomeContainer,
  Header,
  Icon,
  PageTitle,
  PageDescription,
  TabsContainer,
  Tab,
  TabTitle,
  TabDescription,
  TabImage,
  TabButton,
} from '../GlobalStyles/Elements';

function Home() {
  // Data for the 5 tabs
  const tabsData = [
    {
      title: 'Time & Day',
      description: 'Explore how the day and time of trending video uploads changed over time and if it impacts popularity.',
      image: '/images/tab1.jpg',
      link: '/page1',
    },
    {
      title: 'Disabled Metrics',
      description: 'Explore how keywords, tags, and categories most associated with disabled comments or ratings changed over time.',
      image: '/images/tab2.jpg',
      link: '/page2',
    },
    {
      title: 'Popularity',
      description: 'Explore how the volume of views/comments/ratings count changed over time.',
      image: '/images/tab3.jpg',
      link: '/page3',
    },
    {
      title: 'Sentiment',
      description: 'Explore how sentiment effects views and if it has changed over time.',
      image: '/images/tab4.jpg',
      link: '/page4',
    },
    {
      title: 'Events',
      description: 'Explore how certain real world events affected the volume of views/comments/ratings count over time.',
      image: '/images/tab5.jpg',
      link: '/page5',
    },
  ];

  return (
    <HomeContainer>
      {/* Top Section with Logo */}
      <Header>
        <Icon to="/">YouTrend</Icon>
      </Header>

      {/* Page Title and Description */}
      <PageTitle>Welcome to Your Homepage</PageTitle>
      <PageDescription>Discover the latest trends and updates tailored for you.</PageDescription>

      {/* Tabs Section */}
      <TabsContainer>
        {tabsData.map((tab, index) => (
          <Tab key={index}>
            <TabTitle>{tab.title}</TabTitle>
            <TabDescription>{tab.description}</TabDescription>
            <TabImage src={tab.image} alt={tab.title} />
            <TabButton to={tab.link}>Learn More</TabButton>
          </Tab>
        ))}
      </TabsContainer>
    </HomeContainer>
  );
}

export default Home;
