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
      title: 'Tab 1',
      description: 'This is the description for Tab 1.',
      image: '/images/tab1.jpg',
      link: '/page1',
    },
    {
      title: 'Tab 2',
      description: 'This is the description for Tab 2.',
      image: '/images/tab2.jpg',
      link: '/page2',
    },
    {
      title: 'Tab 3',
      description: 'This is the description for Tab 3.',
      image: '/images/tab3.jpg',
      link: '/page3',
    },
    {
      title: 'Tab 4',
      description: 'This is the description for Tab 4.',
      image: '/images/tab4.jpg',
      link: '/page4',
    },
    {
      title: 'Tab 5',
      description: 'This is the description for Tab 5.',
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
