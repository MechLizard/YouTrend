# YouTrend
Organizing and displaying information about trending youtube videos from a dataset. 

Installation:

*Assuming your repo is forked and cloned already*

1. Install Dependencies <br/>
```npm install express oracledb dotenv```

2. Setup .env File <br/>
*Note: Copy/Paste the following in the .env file you create in the root directory (replace USER and PASSWORD with your valid information)*

```ORACLE_USER=YourGatorlinkUsername``` <br/>
```ORACLE_PASSWORD=YourDatabasePassword``` <br/>
```ORACLE_CONNECTION_STRING=oracle.cise.ufl.edu:1521/orcl```

3. Start Server <br/>
```Connect to Gatorlink VPN?``` <br/>
```cd Backend``` <br/>
```node server.js``` 

4. Start Frontend <br/>
```npm run start:frontend``` <br/>
