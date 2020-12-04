1. from the folder's root directory enter the following command to download the correct dependencies for the project:

  npm install

2. in order to have some data to display and mess around with, run the populatedb.js script by entering the following command. ONLY RUN THIS SCRIPT ONCE DAILY TO AVOID DUPLICATE DATA. The songs will delete every day.:

  node populatedb

3. now you should be able to run the web server by entering the following command:

  npm run start

4. in your browser, go to localhost:3000. Because you have not logged in, you will be redirected to localhost:3000/login

5. from here, create a new account and login.

6. you will be taken to the home page where you can add one song per day, and like one song per day. 

7. There is a navigation bar for logging out and changing the user information
8. The export playlist button will take you to a page that displays the top 15 most liked songs, which is playlist of the day.
