const express = require("express");
const router = express.Router();

module.exports = (userController) => {
  //Users
  // Get all rooms
  router.get("/", userController.getAllUsers);
  router.get("/:userId", userController.getUserRoles);
  //   //Get user by ID
  //   router.get("/:userId", usersController.getUserById);
  //   //Get user roles
  //   router.get("/:userId/roles", usersController.getUserRoles);


  return router;
};
