import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function EventPopup({
  isOpen,
  eventData,
  onChange,
  onSave,
  onCancel,
  onDelete,
  onCheckAvailability,
}) {
  const [location, setLocation] = useState("");
  const [value, setValue] = React.useState(0);
  const [showForm, setShowForm] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [toolOptions, setToolOptions] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedCal, setSelectedCal] = useState("");
  const [personalEvents, setPersonalEvents] = useState([]);
  const [possibleRooms, setPossibleRooms] = useState([]);
  const [roomEvents, setRoomEvents] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const [assistantData, setAssistantData] = useState({
    preferredPeriod: "",
    duration: "",
    equipment: "",
    participants: "",
  });

  const serverURL = process.env.REACT_APP_SERVER_URL;
  const serverURL_personalEvents = serverURL + "persoanlEvents";
  const serverURL_calendars = serverURL + "calendars";
  const serverURL_events = serverURL + "events";

  useEffect(() => {
    const fetchToolOptions = async () => {
      try {
        // Fetch the tool options from the server
        const toolResponse = await fetch(
          "http://localhost:3001/rooms/tools/list"
        );
        const toolData = await toolResponse.json();
        console.log("toolData:", toolData);
        setToolOptions(toolData);
      } catch (error) {
        console.log("Error fetching tool options:", error);
      }
    };
    fetchToolOptions();
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleChange = (field) => (event) => {
    if (field === "location") {
      const selectedLocation = eventData.roomOptions.find(
        (room) => room.name === event.target.value
      );
      onChange({
        ...eventData,
        location: event.target.value,
        capacity: selectedLocation ? selectedLocation.capacity : "",
      });
    } else if (field === "attendees") {
      const emails = event.target.value.split(",");
      onChange({
        ...eventData,
        attendees: emails.map((email) => email.trim()),
      });
    } else if (field === "summary") {
      onChange({
        ...eventData,
        ["title"]: event.target.value,
      });
    } else {
      onChange({
        ...eventData,
        [field]: event.target.value,
      });
    }
  };

  const handleCheckboxChange = () => (event) => {
    onChange({ ...eventData, ["publicEvent"]: event.target.checked });
  };

  const checkAvailability = (field) => (e) => {
    onCheckAvailability(); // Call the onCheckAvailability prop with the eventData
  };

  //Assistant

  const fetchPersonalEvents = async () => {
    try {
      setPersonalEvents([]);
      const requests = eventData.attendees.map(async (owner) => {
        const encodedOwner = encodeURIComponent(owner);
        const response = await fetch(
          serverURL_personalEvents + "/" + encodedOwner
        );
        if (response.ok) {
          const eventsData = await response.json();
          const formattedEvents = eventsData.map((event) => ({
            id: event.eventId,
            title: event.summary,
            start: event.startDateTime,
            end: event.endDateTime,
            room: "other",
          }));
          return formattedEvents;
        } else {
          return [];
        }
      });
      const eventsByOwner = await Promise.all(requests);
      const mergedEvents = eventsByOwner.flat();
      setPersonalEvents(mergedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchRoomsWithTools = async () => {
    try {
      setPossibleRooms([]);
      // Convert selectedTools into a string and encode it
      const toolsParam = encodeURIComponent(selectedTools.join(","));
      // Fetch the data from the server
      console.log(
        `http://localhost:3001/rooms/roomWithTools/list?tools=${toolsParam}`
      );
      const response = await fetch(
        `http://localhost:3001/rooms/roomWithTools/list?tools=${toolsParam}`
      );
      // Parse the response to JSON
      const data = await response.json();
      const roomNames = data.map((room) => room.name);
      setPossibleRooms((prevRooms) => [...prevRooms, ...roomNames]);
    } catch (error) {
      console.log("Error fetching rooms with tools:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const requests = possibleRooms.map(async (room) => {
        const responseCalId = await fetch(
          `${serverURL_calendars}/id?summary=${encodeURIComponent(room)}`
        );

        if (responseCalId.ok) {
          const calId = await responseCalId.json();
          const encodedCalendar = encodeURIComponent(calId.id);
          const responseEvents = await fetch(
            `${serverURL_events}/calendar/${encodedCalendar}`
          );
          console.log(`${serverURL_events}/calendar/${encodedCalendar}`);

          if (responseEvents.ok) {
            const eventsData = await responseEvents.json();
            const formattedEvents = eventsData.map((event) => ({
              id: event.eventId,
              title: event.summary,
              start: event.startDateTime, // Assuming your event object has a 'startDateTime' property
              end: event.endDateTime, // Assuming your event object has an 'endDateTime' property
              room: room,
            }));
            //console.log("Events:",formattedEvents)
            return formattedEvents;
          } else {
            return [];
          }
        }
      });
      const eventsByRoom = await Promise.all(requests);
      const mergedEvents = eventsByRoom.flat();
      setRoomEvents(mergedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleToolChange = (event) => {
    setSelectedTools(event.target.value);
  };

  const handleAssistantChange = (field) => (event) => {
    setAssistantData({
      ...assistantData,
      [field]: event.target.value,
    });
  };

  const handleAssistantSubmit = () => {
    console.log("Participants:", eventData.attendees);
    console.log("Tools:", selectedTools);
    console.log("Preferred Time:", assistantData.preferredPeriod);
    console.log("Duration:", assistantData.duration);
    const start = new Date(eventData.start);
    const dateString = start.toISOString().split("T")[0];
    console.log("Start:", dateString);

    fetchPersonalEvents();
    fetchRoomsWithTools();
    fetchEvents();

    console.log("Personal Events:", personalEvents);
    console.log("Possible Rooms:", possibleRooms);
    console.log("Room Events:", roomEvents);
    // ... rest of your submit logic here

    const data = {
      personalEvents: personalEvents,
      officialEvents: roomEvents,
      possibleRooms: possibleRooms,
      preferredDate: dateString,
      preferredTime: assistantData.preferredPeriod,
      duration: Number(assistantData.duration),
    };

    fetch("http://localhost:3001/events/assist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Error: " + response.status);
          return [];
        }
      })
      .then((data) => {
        console.log("Available slots:", data);
        setAvailableTimeSlots(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  
  const onAssistantBook = async (index) => {
    try {
      const calendarResponse = await fetch(
        `http://localhost:3001/calendars/id?summary=${encodeURIComponent(
          availableTimeSlots[index].room
        )}`
      );
      if (!calendarResponse.ok) {
        console.log("Response not okay");
        throw new Error("Network response was not ok");
      }
      const calendarData = await calendarResponse.json();

      if (!calendarData.id || !availableTimeSlots[index]) {
        throw new Error("Invalid data received");
      }

      eventData.calendar = calendarData.id;
      eventData.title = eventData.title + "[A]";
      eventData.end = availableTimeSlots[index].end;
      eventData.start = availableTimeSlots[index].start;
      eventData.location = availableTimeSlots[index].room;

      // assuming onChange is a synchronous function
      // if it's not, you might want to use await onChange({ ...eventData });
      onChange({ ...eventData });
      onSave(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onManualBook = async (index) => {
    try {
      console.log(
        `http://localhost:3001/calendars/id?summary=${encodeURIComponent(
          eventData.location
        )}`
      );
      const calendarResponse = await fetch(
        `http://localhost:3001/calendars/id?summary=${encodeURIComponent(
          eventData.location
        )}`
      );
      if (!calendarResponse.ok) {
        console.log("Response not okay");
        throw new Error("Network response was not ok");
      }
      const calendarData = await calendarResponse.json();
      console.log("Calendar Data:", calendarData.id);
      if (!calendarData.id) {
        throw new Error("Invalid data received");
      }

      eventData.calendar = calendarData.id;
      eventData.title = eventData.title + "[M]";
      eventData.start = `${eventData.start}:00.000Z`;
      eventData.end = `${eventData.end}:00.000Z`;
      // assuming onChange is a synchronous function
      // if it's not, you might want to use await onChange({ ...eventData });
      onChange({ ...eventData });
      onSave(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: "80vh", // Set fixed height to 80% of viewport height
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
          outline: "none",
          overflowY: "auto", // Make the box scrollable vertically
          overflowX: "hidden", // Prevent horizontal scrolling
        }}
      >
        <Tabs value={value} onChange={handleTabChange} aria-label="tabs">
          <Tab label="Assistant" />
          <Tab label="Manual" />
        </Tabs>

        <TabPanel value={value} index={0}>
          {/* Assistant content starts here */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Assistant Event
            </Typography>

            <TextField
              label="Summary"
              fullWidth
              value={eventData.title}
              onChange={handleChange("summary")}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={eventData.description || ""}
              onChange={handleChange("description")}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Preferred Period</InputLabel>
              <Select
                value={assistantData.preferredPeriod || ""}
                onChange={handleAssistantChange("preferredPeriod")}
              >
                <MenuItem value={"morning"}>Morning (10:00 - 12:00)</MenuItem>
                <MenuItem value={"afternoon"}>
                  Afternoon (12:00 - 14:00)
                </MenuItem>
                <MenuItem value={"evening"}>Evening (14:00 - 18:00)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Duration (in minutes)"
              type="number"
              fullWidth
              value={assistantData.duration || ""}
              onChange={handleAssistantChange("duration")}
              sx={{ mb: 2 }}
              InputProps={{ inputProps: { min: 30, step: 30 } }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Equipment</InputLabel>
              <Select
                multiple
                value={selectedTools}
                onChange={handleToolChange}
                renderValue={(selected) => selected.join(", ")}
              >
                {toolOptions && Array.isArray(toolOptions) ? (
                  toolOptions.map((tool, index) => (
                    <MenuItem key={index} value={tool.name}>
                      {tool.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No options available</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              label="Attendees"
              fullWidth
              multiline
              rows={2}
              value={eventData.attendees ? eventData.attendees.join("\n") : ""}
              onChange={handleChange("attendees")}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Button
              variant="contained"
              onClick={handleAssistantSubmit}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableTimeSlots.map((slot, index) => (
                  <TableRow key={index}>
                    <TableCell>{slot.start.split("T")[0]}</TableCell>
                    <TableCell>
                      {slot.start.split("T")[1].split(".")[0]}
                    </TableCell>
                    <TableCell>{slot.room}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onAssistantBook(index)}
                      >
                        Book
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Assistant content ends here */}
        </TabPanel>

        <TabPanel value={value} index={1}>
          {/* Manual content starts here */}
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Add Event
          </Typography>

          <TextField
            label="Summary"
            fullWidth
            value={eventData.title}
            onChange={handleChange("summary")}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={eventData.description || ""}
            onChange={handleChange("description")}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Start Date/Time"
            type="datetime-local"
            fullWidth
            value={eventData.start || ""}
            onChange={handleChange("start")}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="End Date/Time"
            type="datetime-local"
            fullWidth
            value={eventData.end || ""}
            onChange={handleChange("end")}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={eventData.publicEvent || false}
                onChange={handleCheckboxChange()}
              />
            }
            label="Public"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={eventData.location || ""}
              onChange={handleChange("location")}
            >
              {eventData.roomOptions && Array.isArray(eventData.roomOptions) ? (
                eventData.roomOptions.map((room, index) => (
                  <MenuItem key={index} value={room.name}>
                    {room.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No options available</MenuItem>
              )}
            </Select>
          </FormControl>

          {eventData.publicEvent ? (
            <TextField
              label="Capacity"
              fullWidth
              value={eventData.capacity || ""}
              disabled
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <TextField
              label="Attendees"
              fullWidth
              multiline
              rows={2}
              value={eventData.attendees ? eventData.attendees.join("\n") : ""}
              onChange={handleChange("attendees")}
              sx={{ mb: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={onManualBook} sx={{ mr: 1 }}>
              Save Event
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onDelete}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
          </Box>
          {/* Manual content ends here */}
        </TabPanel>
      </Box>
    </Modal>
  );
}
export default EventPopup;
