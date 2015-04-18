# Cards of Legends
## League of Legends API challenge
## http://urf.ninja
#### Description
Cards of Legends fulfills the ultimate URF strategy dream by combining the 'intense real time thrill of an online card game' with the mayhem of URF mode stats... will you weild an army of overpowered Sejuani or dominate with a balanced deck of 8 Teemos and an Alistar...

#### Want to just play?
- Visit http://urf.ninja
- Bash in a username and password (no limits or restrictions, just a nice way to access your account again}...

#### Want to set it up yourself?
- You will need:
* Patience (hey, its a hack!)
* A copy of mongodb (https://mongolab.com/)
* Node, we recommend to use nvm (https://github.com/creationix/nvm)
* Linux (May work on Mac OSX)
* Riot Games API key to build your card database

- Optionally, if you want to change the stats on your cards, trigger shinies, ban champions... you will need:
* Ability to write basic javascripts
* More Patience (it really is a hack!)

#### Technical Setup Linux
You will need to clone the repo and create a .env file
- ``` .env ```
```
export API_KEY=12345678
export PORT=1337
export NODE_ENV=production
export MONGO_URL=mongodb://yourmongoconnectionstring
export SESSION_SECRET=somestring123
export URF_SALT=somethingelse21343324
```
--------------------------
Install dependencies
- ```$ npm install```
--------------------------
Fill database with cards (this can be tweaked to your desire - scripts/parse/generators)
-``` $ npm run feed```
--------------------------
Start the server on the exposed PORT environment variable
- ```$ npm run start```
--------------------------
Access via http://localhost:PORT/

#### Authors
Robert Preus-MacLaren (RpprRoger)
Anthony Stansbridge (Stansbridge) 

