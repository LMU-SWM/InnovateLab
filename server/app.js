const express = require("express");
const eventRoutes = require("./routes/eventRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const roomRoutes = require("./routes/roomRoutes");
const availablityRoutes = require("./routes/availablityRoutes");
const identityrRoutes = require("./routes/identityRoutes");
const personalEventsRoutes = require("./routes/personalEventsRoutes");
const cors = require("cors");

const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());
app.use(cors());

const connectionString =
  "mongodb+srv://lmuswm:trialpassword123@i-prototypecluster.wqxzkwq.mongodb.net/?retryWrites=true&w=majority";
MongoClient.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    const db = client.db("Innovate");
    console.log("Connected to MongoDB Atlas");

    // Pass the database connection to the controllers or services if needed
    const eventController = require("./controllers/eventController")(db);
    const calendarController = require("./controllers/calendarController")(db);
    const roomController = require("./controllers/roomController")(db);
    const availablityController =
      require("./controllers/availablityController")(db);
    const identityController = require("./controllers/identityController")(db);
    const personalEventsController = require("./controllers/personalEventsController")(db);

    // Register the event and calendar routes
    app.use("/availablity", availablityRoutes(availablityController));
    app.use("/events", eventRoutes(eventController));
    app.use("/persoanlEvents", personalEventsRoutes(personalEventsController));
    app.use("/calendars", calendarRoutes(calendarController));
    app.use("/rooms", roomRoutes(roomController));
    app.use("/identity", identityrRoutes(identityController));

    // Start the server
    app.listen(3001, () => {
      console.log("Server started on port 3001");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });
