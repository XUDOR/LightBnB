CREATE TABLE "User" (
  "UserID" int PRIMARY KEY,
  "Name" varchar(255),
  "Email" varchar(255) UNIQUE,
  "Password" varchar(255)
);

CREATE TABLE "Property" (
  "PropertyID" int PRIMARY KEY,
  "OwnerID" int,
  "Title" varchar(255),
  "Description" text,
  "CostPerNight" decimal,
  "ParkingSpaces" int,
  "NumberOfBathrooms" int,
  "NumberOfBedrooms" int,
  "ThumbnailURL" varchar(255),
  "CoverPhotoURL" varchar(255),
  "Country" varchar(255),
  "Street" varchar(255),
  "City" varchar(255),
  "Province" varchar(255),
  "PostCode" varchar(255),
  "IsActive" boolean
);

CREATE TABLE "Reservation" (
  "ReservationID" int PRIMARY KEY,
  "GuestID" int,
  "PropertyID" int,
  "StartDate" date,
  "EndDate" date
);

CREATE TABLE "PropertyReview" (
  "ReviewID" int PRIMARY KEY,
  "ReservationID" int,
  "Message" text,
  "Rating" int
);

COMMENT ON COLUMN "PropertyReview"."Rating" IS 'Rating must be between 1 and 5';

ALTER TABLE "Property" ADD FOREIGN KEY ("OwnerID") REFERENCES "User" ("UserID");

ALTER TABLE "Reservation" ADD FOREIGN KEY ("GuestID") REFERENCES "User" ("UserID");

ALTER TABLE "Reservation" ADD FOREIGN KEY ("PropertyID") REFERENCES "Property" ("PropertyID");

ALTER TABLE "PropertyReview" ADD FOREIGN KEY ("ReservationID") REFERENCES "Reservation" ("ReservationID");
