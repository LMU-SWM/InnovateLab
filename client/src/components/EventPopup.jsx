import React from "react";
import { Modal, Box, Typography, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";

function EventPopup({ isOpen, eventData, onChange, onSave, onCancel, onDelete }) {
  const handleChange = (field) => (e) => {
    onChange({ ...eventData, [field]: e.target.value });
  };

  const handleCheckboxChange = (field) => (e) => {
    onChange({ ...eventData, [field]: e.target.checked });
  };

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
          value={eventData.summary || ""}
          onChange={handleChange("summary")}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Location"
          fullWidth
          value={eventData.location || ""}
          onChange={handleChange("location")}
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
          value={eventData.startDateTime || ""}
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
          value={eventData.endDateTime || ""}
          onChange={handleChange("endDateTime")}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={eventData.allDay || false}
              onChange={handleCheckboxChange("allDay")}
            />
          }
          label="All Day"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Attendees"
          fullWidth
          multiline
          rows={2}
          value={eventData.attendees || ""}
          onChange={handleChange("attendees")}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={onSave} sx={{ mr: 1 }}>
            Save Event
          </Button>
          <Button variant="contained" color="error" onClick={onDelete} sx={{ mr: 1 }}>
            Delete
          </Button>
          <Button variant="contained" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EventPopup;
