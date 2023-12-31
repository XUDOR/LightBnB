DROP TABLE IF EXISTS property_review CASCADE;
DROP TABLE IF EXISTS property_reviews CASCADE;
DROP TABLE IF EXISTS reservation CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS property CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE properties (
   property_id SERIAL PRIMARY KEY,
   owner_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
   title VARCHAR(255) NOT NULL,
   description TEXT,
   cost_per_night DECIMAL,
   parking_spaces INTEGER,
   number_of_bathrooms INTEGER,
   number_of_bedrooms INTEGER,
   thumbnail_photo_url VARCHAR(255),  -- Changed from thumbnail_url
   cover_photo_url VARCHAR(255),
   country VARCHAR(255) NOT NULL,
   street VARCHAR(255) NOT NULL,
   city VARCHAR(255) NOT NULL,
   province VARCHAR(255) NOT NULL,
   post_code VARCHAR(255) NOT NULL,
   active BOOLEAN DEFAULT TRUE
);



CREATE TABLE reservations (
   id SERIAL PRIMARY KEY,
   guest_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
   property_id INTEGER REFERENCES properties(property_id) ON DELETE CASCADE,
   start_date DATE NOT NULL,
   end_date DATE NOT NULL
);


CREATE TABLE property_reviews (
   id SERIAL PRIMARY KEY,
   guest_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
   property_id INTEGER REFERENCES properties(property_id) ON DELETE CASCADE,
   reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
   message TEXT,
   rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

COMMENT ON COLUMN property_reviews.rating IS 'Rating must be between 1 and 5';

