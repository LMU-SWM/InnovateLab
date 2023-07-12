import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

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
    } else {
      onChange({
        ...eventData,
        [field]: event.target.value,
      });
    }
  };

  const handleCheckboxChange = (field) => (e) => {
    onChange({ ...eventData, [field]: e.target.checked });
  };

  const checkAvailability = (field) => (e) => {
    onCheckAvailability(); // Call the onCheckAvailability prop with the eventData
  };

  console.log("Event Popup:", eventData);

  return (
    <Modal open={isOpen} onClose={onCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
          outline: "none", // Remove the default outline
        }}
      >
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
          onChange={handleChange("startDateTime")}
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
          onChange={handleChange("endDateTime")}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={eventData.publicEvent || false}
              onChange={handleCheckboxChange("publicEvent")}
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
          // Show capacity input for public event
          <TextField
            label="Capacity"
            fullWidth
            value={eventData.capacity || ""}
            disabled // Make it uneditable
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        ) : (
          // Show attendees input for private event
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
          <Button variant="contained" onClick={onSave} sx={{ mr: 1 }}>
            Save Event
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onDelete}
            sx={{ mr: 1 }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={onCheckAvailability}
            sx={{ mr: 1 }}
          >
            Check Availability
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EventPopup;
