# Sounds 54
Music streaming web application built using Next.js

## How to Start the Application

1. Clone this repository locally and open it with your preferred IDE.
2. Run the Redis server by opening a terminal window and running the command: `redis-stack-server`.
   - Rename the env file to .env in the 'streaming-service-backend' folder.
3. Open a new terminal window and change your directory to 'streaming-service-backend':
   - Run `npm i` to install all packages.
   - Run the seed file to populate the database with data by running: `npm run seed`.
   - Start the server by running: `npm run dev`.
4. Open another terminal window and change your directory to 'streaming-service-frontend':
   - Rename the "env.local" file to ".env.local" in the 'streaming-service-backend' folder.
   - Run `npm i` to install all packages.
   - Build the app by running: `npm run dev`.
5. Go to your browser at http://localhost:3000 and log in or register as a new user.




Further Info about seed data
1. You can configure the number of user and artist you want to seed in the big_seed.js file.
 - change the `usersToBeSeeded` and `artistsToBeSeeded` variables. albums and songs will be generated based on the number of artists.
2. The seed data is generated using the faker library.
3. Passwords for all users are set to "Password123$". Please get email from the databased as they are randomly generated
4. use '/login/admin' to login as an admin.
5. admin credentials are:
   - email: hansolo@example.com
   - password: HanSolo@1234
6. When you load huge data admin page might take a while to load.
7. we are only using ~100 actual song files for the seed data. These are resued by all the songs seed data so when you play songs you might see the same song file being used multiple times.
8. the song files are located in the 'streaming-service-backend/utils/songData' folder.
9. Deployment links : frontend -> https://project554-ca5be6o55-tharuns-projects-078b2bbf.vercel.app/artist and backend -> https://streaming-service-backend.onrender.com

