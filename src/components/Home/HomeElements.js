// Homepage Container
export const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px;
    background-color: ${({ theme }) => theme.colors.secondary};
    min-height: 100vh;
`;

// Logo and Title Section
export const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
`;

export const Logo = styled(Link)`
    font-size: 36px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
`;

export const PageTitle = styled.h1`
    font-size: 28px;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const PageDescription = styled.p`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 20px;
`;

// Tabs Section
export const TabsContainer = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
`;

export const Tab = styled.div`
    flex: 1;
    padding: 20px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 8px;
    color: #fff;
    margin: 0 10px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

export const TabTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 10px;
`;

export const TabDescription = styled.p`
    font-size: 14px;
    margin-bottom: 10px;
`;

export const TabImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 4px;
    margin-bottom: 10px;
`;

export const TabButton = styled(Link)`
    display: inline-block;
    padding: 10px 20px;
    background-color: ${({ theme }) => theme.colors.accent};
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    text-align: center;

    &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
    }
`;
