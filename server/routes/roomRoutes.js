const express = require("express");
const router = express.Router();

module.exports = (roomController) => {
  //Rooms
  // Create a room
  router.post("/", roomController.createRoom);
  //edit room
  router.put("/:roomId", roomController.editRoom);
  // Delete a room
  router.delete("/:roomId", roomController.deleteRoom);
  // Get all rooms
  router.get("/", roomController.getAllRooms);
  // Get all tools available
  router.get("/tools/list", roomController.getAllTools);
  // Get room by tools
  router.get("/roomWithTools/list", roomController.getRoomsWithSpecificTools);
  // Get room by ID
  router.get("/:roomId", roomController.getRoomById);
  
  //Items
  // Add an item to a room
  router.post("/:roomId/items", roomController.addItemToRoom);
  // Remove an item from a room
  router.delete("/:roomId/items/:itemId", roomController.removeItemFromRoom);

  // Implement other event routes here

  return router;
};
