const { google } = require("googleapis");
const { MongoClient } = require("mongodb");
const Room = require("../models/rooms");
const { v4: uuidv4 } = require('uuid');

module.exports = (db) => {
  // Controller for creating a room
  const createRoom = async (req, res) => {
    try {
      const { name, capacity } = req.body;

      // Create a new room document using the Room model
      const newRoom = new Room({
        name: name,
        capacity: capacity,
        items: [],
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

  const getAllRooms = async (req, res) => {
    try {
      // Retrieve all room documents from MongoDB using the Room model
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
      const deletionResult = await roomCollection.deleteOne({ roomId: req.params.roomId });
      
      if (deletionResult.deletedCount === 1) {
        res.json({ message: "Room deleted successfully" + req.params.roomId  });
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
      const newItem = { name, image, itemId};
      room.items.push(newItem);

      // Save the updated room document to MongoDB
      await roomCollection.updateOne({ roomId: roomId }, { $set: { items: room.items } });

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
      await roomCollection.updateOne({ roomId: roomId }, { $set: { items: room.items } });
  
      res.json({ message: "Item removed from the room successfully", room });
    } catch (error) {
      console.error("Error removing item from room:", error);
      res.status(500).json({ error: "Failed to remove item from room" });
    }
  };
  
  return {
    createRoom,
    deleteRoom,
    getAllRooms,
    getRoomById,
    addItemToRoom,
    removeItemFromRoom,
    // Export other calendar-related functions here
  };
};


Discussion:

The meeting revolved around the access and utilization of SWM resources for your project, with two primary points of discussion:
IT Infrastructure for Employee Data Storage: An expert was involved to provide more information about the IT infrastructure utilized at SWM for storing employee data. The team sought to understand the system specifics such as identity management system employed by SWM for facilitating the design of appropriate user authentication and access control mechanisms.
Hosting Options on SWM-Owned Server: The feasibility of hosting the application on an SWM server was discussed, considering their policies, security standards, and hosting procedures. In case hosting on SWM servers wasn't feasible, the discussion would pivot towards alternative hosting options like cloud service providers or managed hosting services.
Additionally, the topic of ChatGPT was touched upon, noting its test phase status and API accessibility restrictions within the internal network. However, the priority for this has been deprioritized.

Conclusion:

Due to the short duration of the project and procedural requirements for a "Schutzbedarfsfeststellung", it was concluded that it was not viable to utilize SWM resources for the project. Therefore, the following changes need to be considered:
Continue Development with Available Resources: Development of the prototype needs to continue using the available resources. It was acknowledged that the prototype's integration and progress might not be perfect.
Conversion to Docker: Given the circumstances, the project needs to convert its entire infrastructure to Docker containers. This implies that the application would need to be designed and packaged into Docker containers to ensure its portability and seamless operation irrespective of the hosting environment, which may not be the initially intended SWM servers.