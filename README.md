
Make a new project and cluster for your database
1.  Go to your MongoDB Atlas account
2.  Go to your ‘Projects’ and click ‘+ New Project’
3.  Give your project any name then press ‘Next’
4.  Make sure you are the project owner and then press the button ‘Create Project’
5.  Press the button ‘Build a Cluster’ and choose the free option
6.  Choose Any provider then press the ‘Create Cluster’ button
7.  Click the ‘Collections’ button
8.  Choose the ‘Add My Own Data’ option
9.  Fill out the ‘Create Database’ information
10. Go back to the ‘Overview’ tab and choose ‘Connect’
      a. Choose the ‘Add Your Current IP Address’ option
      b. Create Database User
            i.  Exampe Username: 360User
            ii. Example Password:  360Pass
      c. Choose the ‘Connect your application’ option
            i. Example URL mongodb+srv://360User:360Pass@cluster0.yhpoq.mongodb.net/360Test?retryWrites=true&w=majority
      d. Press close once done

Connect to MongoDB
1.  Open up app.js, loginController.js, playlistController.js, songController.js, userController.js, populatedb.js from the cloned repository 
2.  Replace the current 'var mongoDB’ string with the URL from earlier


Run the Website
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
