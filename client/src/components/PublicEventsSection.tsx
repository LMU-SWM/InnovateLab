import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import axios from 'axios';


interface EventData {
  _id: string;
  eventId: string;
  owner: string;
  team: string;
  summary: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
  attendees: { email: string }[];
  googleCalendarEventId: string;
  calendarId: string;
}

interface PublicEventsSectionProps {
  events: EventData[];
}

const PublicEventsSection: React.FC<PublicEventsSectionProps> = ({
  events,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedEventData, setEditedEventData] = useState<EventData | null>(
    null
  );
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [approvalEmails, setApprovalEmails] = useState("");
  const [approvalImage, setApprovalImage] = useState("");
  

  const handleNextEvent = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const handlePreviousEvent = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  const handleEditEvent = (index: number) => {
    setActiveIndex(index);
    setEditedEventData({ ...events[index] });
    setShowEditPopup(true);
  };

  const handleClosePopup = () => {
    setShowEditPopup(false);
    setEditedEventData(null);
  };

  async function deleteEvent(eventId: string, user: string) {
    const url = `http://localhost:3001/events/${eventId}`;
    const headers = { "Content-Type": "application/json" };
    const data = { user: user };

    try {
      const response = await axios.delete(url, {
        headers: headers,
        data: data,
      });
      console.log(`Event deleted: ${response.data}`);
    } catch (error) {
      console.error(`Error deleting event: ${error}`);
    }
  }

  async function getEventById(owner: string, eventId: string) {
    const url = `http://localhost:3001/events?owner=${owner}&eventId=${eventId}`;
    console.log("URL:", url);
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data; // Return the event data
    } catch (error) {
      console.error(`Error fetching event: ${error}`);
      return { error: `Error fetching event: ${error}` };
    }
  }

  async function moveToPublic(event: any) {
    const url = `http://localhost:3001/public`;
    console.log("URL:", url);
    try {
      const response = await axios.post(url, event);
      console.log(response);
      return response.data; // Return the event data
    } catch (error) {
      console.error(`Error moving event to public: ${error}`);
      return { error: `Error moving event to public: ${error}` };
    }
  }


  const handleDeclineEvent = async () => {
    const eventID = editedEventData?.eventId || "";
    await deleteEvent(eventID, "ADMIN");
    setShowEditPopup(false);
  };

  const handleApproveEvent = (index: number) => {
    setActiveIndex(index);
    setEditedEventData({ ...events[index] });
    setShowApprovalPopup(true);
  };

  const handleCloseApprovalPopup = () => {
    setShowApprovalPopup(false);
    setApprovalEmails("");
  };

  const handleApprovalEmailsChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setApprovalEmails(event.target.value);
  };

  const handleApprovalImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setApprovalImage(event.target.value);
  };

  const handleApproveEventSubmit = async() => {
    // Handle the logic for approving the event with the provided email IDs
    console.log("Event approved with emails:", approvalEmails);
    const eventID = editedEventData?.eventId || "";
    const event = (await getEventById( "ADMIN", eventID))[0];
    event.image = approvalImage;
    console.log("Event:", event);
    handleCloseApprovalPopup();
    await moveToPublic(event);
    await deleteEvent(eventID, "ADMIN");
    setShowEditPopup(false);

  };

  if (events.length === 0) {
    return <p>No events available</p>;
  }

  const activeEvent = events[activeIndex];

  return (
    <div style={{ background: "#f1f1f1", padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Public Events</h2>
        <div>
          <IconButton onClick={handlePreviousEvent}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={handleNextEvent}>
            <NavigateNextIcon />
          </IconButton>
        </div>
      </div>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {activeEvent.summary}
          </Typography>
          <Typography color="text.secondary">
            Location: {activeEvent.location}
          </Typography>
          <Typography color="text.secondary">
            Stat: {activeEvent.startDateTime}
          </Typography>
          {/* Add more event details fields as needed */}
        </CardContent>
      </Card>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <IconButton onClick={() => handleEditEvent(activeIndex)}>
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => handleApproveEvent(activeIndex)}
          color="primary"
        >
          <CheckIcon />
        </IconButton>
      </div>

      {/* Edit Event Popup */}
      <Dialog
        open={showEditPopup}
        onClose={handleClosePopup}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Event: {activeEvent.summary}</DialogTitle>
        <DialogContent>
          <TextField
            label="Summary"
            name="summary"
            value={editedEventData?.summary || ""}
            onChange={(e) =>
              setEditedEventData((prevData) => ({
                ...prevData!,
                summary: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={editedEventData?.location || ""}
            onChange={(e) =>
              setEditedEventData((prevData) => ({
                ...prevData!,
                location: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          {/* Add more event details fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setShowApprovalPopup(true)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval Popup */}
      <Dialog
        open={showApprovalPopup}
        onClose={handleCloseApprovalPopup}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Approve Event: {activeEvent.summary}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email IDs (comma-separated)"
            name="approvalEmails"
            value={approvalEmails}
            onChange={handleApprovalEmailsChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL (comma-separated)"
            name="approvalImage"
            value={approvalImage}
            onChange={handleApprovalImageChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApprovalPopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeclineEvent} color="secondary">
            Decline
          </Button>
          <Button onClick={handleApproveEventSubmit} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PublicEventsSection;
