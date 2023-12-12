const db = require('./LightBnB_WebApp-master/db/database.js');


const testUserId = 652; // Replace with a user ID known to have reservations
const limit = 5; // Or any number you prefer

db.getAllReservations(testUserId, limit)
  .then(reservations => console.log(reservations))
  .catch(err => console.error(err));
