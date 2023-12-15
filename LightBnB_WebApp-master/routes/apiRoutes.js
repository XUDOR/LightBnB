const express = require("express");
const database = require("../db/database");

const router = express.Router();

router.get("/properties", (req, res) => {
  console.log("Received request for properties with query:", req.query); // Log the incoming query
  database
    .getAllProperties(req.query, 20)
    .then((properties) => {
      console.log("Properties retrieved from database:", properties); // Log the retrieved properties
      res.send({ properties });
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

router.get("/reservations", (req, res) => {
  const userId = req.session.userId;
  console.log("User ID from session:", userId); // Log the user ID

  if (!userId) {
    console.log("No user ID found in session"); // Log if user ID is not found
    return res.send({ error: "error" });
  }

  database
    .getAllReservations(userId)
    .then((reservations) => {
      console.log("Reservations retrieved for user:", reservations); // Log the retrieved reservations
      res.send({ reservations });
    })
    .catch((e) => {
      console.error("Error in getAllReservations:", e); // Log the error details
      res.send(e);
    });
});

router.post("/properties", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send({ error: "error" });
  }

  const newProperty = req.body;
  newProperty.owner_id = userId;
  database
    .addProperty(newProperty)
    .then((property) => {
      res.send(property);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

module.exports = router;
