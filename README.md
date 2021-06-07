This project is a webapp to play a game of Wheel of Fortune.  The frontend is a react app, the backend is Node.js (with MongoDB for the puzzles) and the scraper will populate a MongoDB with 78000 puzzles.

After cloning the project, create a .env in each folder.
In the backend folder's .env, include:
PORT=<port number to run the backend locally>
MONGO_URL=<URL for the mongodb.  either local or atlas>
In the frontend folder's .env, include:
REACT_APP_API_BASE=<the localhost link to the backend followed by /api/v1/wheel.  The default port is 5000 ie. http://localhost:5000/api/v1/wheel>
In the scraper folder's .env, include:
MONGO_URL=<Same as the the property in the backend .env>

From the terminal:
Run 'npm install' for each folder to download dependencies, the run 'node index' from the scraper folder to populate your database.  In the backend folder, run 'nodemon index' and in the frontend folder run 'npm start'

Once running, to start a game go to the host tab.  If you want to run a custom puzzle, enter the category and phrase yourself, then enter the number of players.  If you want a puzzle from the database, hit Generate Puzzle after entering the number of players.  Each player will have their own tab appear.

Currently, this only supports one round at a time.  When the round is complete, hit reset under the host tab.