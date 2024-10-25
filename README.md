# YouTrend
Organizing and displaying information about trending youtube videos from a dataset. 

Installation:

*Assuming your repo is forked and cloned already*

1. Install Dependencies <br/>
```npm install express oracledb dotenv```

3. Setup .env File <br/>
*Note: Copy/Paste the following in the .env file (replace USER and PASSWORD with your valid information)*

```ORACLE_USER=YourGatorlinkUsername``` <br/>
```ORACLE_PASSWORD=YourDatabasePassword``` <br/>
```ORACLE_CONNECTION_STRING=oracle.cise.ufl.edu:1521/orcl```

4. Start Server <br/>
```cd Backend``` <br/>
```node server.js``` 
