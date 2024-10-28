import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: "#ff3131",
    secondary: "#ff5757",
    accent: "#e77a68",
    textPrimary: "#202124",
    textSecondary: "#5f6368"
  },
  backgrounds: {
    main: '/Media/HomeBG.png',
    secondary: "#ffffff",
  }
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.backgrounds.main};
    background-size: cover;
    background-repeat: no-repeat;
  }
`;
