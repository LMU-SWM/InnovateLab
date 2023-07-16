import React, { Component } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

class CreateMeetingPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title,
      location: this.props.location,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      attendees: this.props.attendees,
      selected: this.props.selected,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.title !== prevProps.title ||
      this.props.location !== prevProps.location ||
      this.props.startTime !== prevProps.startTime ||
      this.props.endTime !== prevProps.endTime ||
      this.props.attendees !== prevProps.attendees ||
      this.props.selected !== prevProps.selected
    
    ) {
      this.setState({
        title: this.props.title,
        location: this.props.location,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        attendees: this.props.attendees,
        selected: this.props.selected,
      });
    }
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  handleLocationChange = (event) => {
    this.setState({ location: event.target.value });
  };

  handleStartTimeChange = (event) => {
    this.setState({ startTime: event.target.value });
  };

  handleEndTimeChange = (event) => {
    this.setState({ endTime: event.target.value });
  };

  handleSubmit = () => {
    const { title, location, startTime, endTime } = this.state;
    const { eventId, calendarId } = this.props;
  
    const eventData = {
      user: localStorage.getItem("USER_IL"),
      calendarId: calendarId,
      summary: title,
      location: location,
      startDateTime: startTime.dateTime,
      endDateTime: endTime.dateTime,
    };
    
    // "user": "sujaycjoshy@gmail.com",
    // "calendarId": "r3ece775d7e9fldapkmao7tl4c@group.calendar.google.com",
    // "owner": "sujaycjoshy@gmail.com",
    // "team": "team_id",
    // "summary": "Event summary Modified",
    // "description": "Event description Modified",
    // "location": "Event location Modified",
    // "startDateTime": "2023-08-25T12:30:00.000Z",
    // "endDateTime": "2023-08-25T15:30:00.000Z",
    // "timeZone": "America/Los_Angeles",
    // "attendees": ["attendee_id1", "attendee_id2"]

    fetch(`http://localhost:3001/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Meeting edited:', data);
        this.props.onUpdate(data);
        this.props.onClose();
      })
      .catch((error) => {
        console.log('Error updating meeting:', error);
      });
  
    this.props.onClose();
  };
  

  handleSendEmail = () => {
    this.props.onSendEmail(this.props.eventId);
  }

  render() {
    const { title, location, startTime, endTime, attendees } = this.state;
    const { open } = this.props;

    return (
      <Dialog open={open} onClose={this.props.onClose}>
        <DialogTitle>Edit Meeting</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            value={title}
            onChange={this.handleTitleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            value={location}
            onChange={this.handleLocationChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Start Time"
            type="text"
            value={startTime}
            onChange={this.handleStartTimeChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="End Time"
            type="text"
            value={endTime}
            onChange={this.handleEndTimeChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="End Time"
            type="text"
            value={attendees}
            onChange={this.handleEndTimeChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} color="secondary">
            Save
          </Button>
          <Button onClick={this.handleSendEmail} color="secondary">
            Send Reminder
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CreateMeetingPopup;
