# Cards of Legends
## League of Legends API challenge
## http://urf.ninja
#### Description
Cards of Legends fulfills the ultimate URF strategy dream by combining the 'intense real time thrill of an online card game' with the mayhem of URF mode stats... will you weild an army of overpowered Sejuani or dominate with a balanced deck of 8 Teemos and a Alistar...

#### Want to just play?
- Find a friend
- Visit http://urf.ninja
- Bash in a username and password (no limits or restrictions, just a nice way to access your account again}...
- Login to the lobby, we'll give you some cards
- Select the cards for your deck,  utilizing all of your strategic prowess
- Press 'Play', we will match you with a game

#### Want to set it up yourself?
You will need:

* Patience (hey, its a hack!)
* A copy of mongodb (https://mongolab.com/)
* Node, we recommend to use nvm (https://github.com/creationix/nvm)
* Tested and built on Linux, should run on any unix-like system, perhaps Windows...
* Riot Games API key to build your card database

#### Notes
Optionally, if you want to change the stats on your cards, trigger shinies, ban champions... you will need:

* Ability to write some Javascript
* More Patience (it really is a hack!)
* Check out the README in scripts/parse/generators

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

#### Tweaking Cards

You will need to modify the game server logic inside server/game/index.js, here you will find a list of predicates that manage the comparison against the stats parsed inside your card generator

#### Tweaking Deck Size

This is currently handled in two locations, the deck handler client and inside the server/db/index.js

#### Start

--------------------------
Install dependencies
 ```$ npm install```
--------------------------
Fill database with cards (this can be tweaked to your desire), send a SIGINT to the process when you are happy with your collection
``` $ npm run feed```
Inside package.json you can modify the date range arguments that will poll the Riot Games URF endpoint
--------------------------
Start the server on the exposed PORT environment variable
```$ npm run start```
--------------------------
Access via http://localhost:PORT/

#### Authors
Robert Preus-MacLaren (RpprRoger)
Anthony Stansbridge (Stansbridge) 

