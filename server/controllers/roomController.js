const { google } = require("googleapis");
const { MongoClient } = require("mongodb");
const Room = require("../models/rooms");
const { v4: uuidv4 } = require("uuid");

module.exports = (db) => {
  // Controller for creating a room
  const createRoom = async (req, res) => {
    try {
      const { name, capacity, items } = req.body;

      // Create a new room document using the Room model
      const newRoom = new Room({
        name: name,
        capacity: capacity,
        items: items,
        roomId: uuidv4(),
      });

      // Save the new room document to MongoDB
      const roomCollection = db.collection("rooms");
      await roomCollection.insertOne(newRoom);

      res.json({
        message: "Room created successfully",
        room: newRoom,
      });
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  };

  const editRoom = async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const { name, capacity, items } = req.body;

      // Find the room document with the provided roomId
      const roomCollection = db.collection("rooms");
      const existingRoom = await roomCollection.findOne({ roomId });
      console.log("Existing:", existingRoom);
      if (!existingRoom) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Update the room document with the new values
      existingRoom.name = name;
      existingRoom.capacity = capacity;
      existingRoom.items = items;
      console.log("New:", existingRoom);
      // Save the updated room document to MongoDB
      await roomCollection.updateOne({ roomId }, { $set: existingRoom });

      res.json({
        message: "Room updated successfully",
        room: existingRoom,
      });
    } catch (error) {
      console.error("Error editing room:", error);
      res.status(500).json({ error: "Failed to edit room" });
    }
  };

  const getAllRooms = async (req, res) => {
    try {
      // Retrieve all room documents from MongoDB using the Room model
      console.log("Start getAllRooms")
      const roomCollection = db.collection("rooms");
      const rooms = await roomCollection.find().toArray();

      res.json(rooms);
    } catch (error) {
      console.error("Error retrieving rooms:", error);
      res.status(500).json({ error: "Failed to retrieve rooms" });
    }
  };

  const getRoomById = async (req, res) => {
    try {
      const roomId = req.params.roomId;

      // Retrieve the room document from MongoDB using the Room model and the provided roomId
      const roomCollection = db.collection("rooms");
      const room = await roomCollection.findOne({ roomId: roomId });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      res.json(room);
    } catch (error) {
      console.error("Error retrieving room:", error);
      res.status(500).json({ error: "Failed to retrieve room" });
    }
  };
  // Controller for deleting a room
  const deleteRoom = async (req, res) => {
    try {
      const roomId = req.params.roomId;

      // Delete the room document from MongoDB using the Room model
      const roomCollection = db.collection("rooms");
      const deletionResult = await roomCollection.deleteOne({
        roomId: req.params.roomId,
      });

      if (deletionResult.deletedCount === 1) {
        res.json({ message: "Room deleted successfully" + req.params.roomId });
      } else {
        res.status(404).json({ error: "Room not found" });
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ error: "Failed to delete room" });
    }
  };
  // Controller for adding an item to a room
  const addItemToRoom = async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const { name, image } = req.body;
      const itemId = uuidv4();

      // Find the room document in MongoDB using the Room model
      const roomCollection = db.collection("rooms");
      const room = await roomCollection.findOne({ roomId: roomId });

      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      // Create a new item and add it to the room's items array
      const newItem = { name, image, itemId };
      room.items.push(newItem);

      // Save the updated room document to MongoDB
      await roomCollection.updateOne(
        { roomId: roomId },
        { $set: { items: room.items } }
      );

      res.json({ message: "Item added to the room successfully", room });
    } catch (error) {
      console.error("Error adding item to room:", error);
      res.status(500).json({ error: "Failed to add item to room" });
    }
  };

  // Controller for removing an item from a room
  const removeItemFromRoom = async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const itemId = req.params.itemId;

      // Find the room document in MongoDB using the Room model
      const roomCollection = db.collection("rooms");
      const room = await roomCollection.findOne({ roomId: roomId });

      if (!room) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      // Find the index of the item in the room's items array
      const itemIndex = room.items.findIndex((item) => item.itemId === itemId);

      if (itemIndex === -1) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      // Remove the item from the room's items array
      room.items.splice(itemIndex, 1);

      // Save the updated room document to MongoDB
      await roomCollection.updateOne(
        { roomId: roomId },
        { $set: { items: room.items } }
      );

      res.json({ message: "Item removed from the room successfully", room });
    } catch (error) {
      console.error("Error removing item from room:", error);
      res.status(500).json({ error: "Failed to remove item from room" });
    }
  };

  // Controller: Find a list of all the tools available in the rooms
  const getAllTools = async (req, res) => {
    try {
      console.log("Start getAllTools")
      const roomCollection = db.collection("rooms");
      const rooms = await roomCollection.find().toArray();
      let tools = [];
      rooms.forEach((room) => {
        tools = tools.concat(room.items);
      });
      res.json(tools);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
    console.log("End getAllTools")
  };

  // Controller: Find a list of rooms which have specific tools/items
  const getRoomsWithSpecificTools = async (req, res) => {
    try {
      const toolNames = decodeURIComponent(req.query.tools).split(",");
      const roomCollection = db.collection("rooms");
      const rooms = await roomCollection.find({ "items.name": { $in: toolNames } }).toArray();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  return {
    createRoom,
    editRoom,
    deleteRoom,
    getAllRooms,
    getRoomById,
    addItemToRoom,
    removeItemFromRoom,
    getAllTools,
    getRoomsWithSpecificTools,
    // Export other calendar-related functions here
  };
};
