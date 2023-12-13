const { Pool } = require('pg');

// Set up your database connection information
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `SELECT * FROM users WHERE email = $1`;
  const values = [email.toLowerCase()]; // Ensure email comparison is case-insensitive
  
  return pool.query(queryString, values)
    .then(res => res.rows[0] || null)
    .catch(err => console.error('query error', err.stack));
};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `SELECT * FROM users WHERE id = $1`;
  const values = [id];
  
  return pool.query(queryString, values)
    .then(res => res.rows[0] || null)
    .catch(err => console.error('query error', err.stack));
};


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const queryString = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [user.name, user.email, user.password];
  
  return pool.query(queryString, values)
    .then(res => res.rows[0])
    .catch(err => console.error('query error', err.stack));
};


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @param {number} limit The maximum number of reservations to retrieve.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
    SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.property_id
    LEFT JOIN property_reviews ON properties.property_id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.property_id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;
  const queryParams = [guest_id, limit];

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack));
};


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.property_id = property_reviews.property_id
`;


  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'} owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'} cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `${queryParams.length === 1 ? 'WHERE' : 'AND'} average_rating >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.property_id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
`;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams).then((res) => res.rows);
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryString = `
    INSERT INTO properties (
      owner_id, title, description, thumbnail_photo_url, cover_photo_url,
      cost_per_night, street, city, province, post_code, country,
      parking_spaces, number_of_bathrooms, number_of_bedrooms
    ) 
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    RETURNING *;
  `;

  const queryParams = [
    property.owner_id, property.title, property.description, 
    property.thumbnail_photo_url, property.cover_photo_url,
    property.cost_per_night, property.street, property.city, 
    property.province, property.post_code, property.country,
    property.parking_spaces, property.number_of_bathrooms, 
    property.number_of_bedrooms
  ];

  return pool.query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => console.error('query error', err.stack));
};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
