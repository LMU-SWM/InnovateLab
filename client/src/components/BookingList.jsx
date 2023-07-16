import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Box,
  Pagination,
} from "@mui/material";
import FilterRoom from "./FilterRoom.jsx";
import FilterBookingType from "./FilterBookingType.jsx";
import ButtonContainer from "./ButtonContainer.jsx";
import FilterCreator from "./FilterCreator.jsx";
import CreateMeetingPopup from "./PopUp";
import axios from "axios";

// const authToken = process.env.REACT_APP_AUTH_TOKEN;
// const calendarId = process.env.REACT_APP_CALENDAR_ID;
// const apiKey  = process.env.REACT_APP_API_KEY;

export default function BookingList() {
  const [checked, setChecked] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const itemsPerPage = 9;
  const [events, setEvents] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedBookingTypes, setSelectedBookingTypes] = useState([]);
  const [forceFetch, setForceFetch] = useState(false);

  useEffect(() => {
    fetchBookingList().then((eventData) => {

    const processedEvents = eventData.map((event) => ({
        id: event.eventId,
        summary: event.summary,
        description: event.description,
        start: moment(event.startDateTime).toDate(),
        end: moment(event.endDateTime).toDate(),
        location: event.location,
        attendees: event.attendees,
        allDay: false,
      }));

    setItems(processedEvents);
    });
  }, [forceFetch]);

  useEffect(() => {
    // Trigger the effect on component mount
    setForceFetch(true);
  }, []);

  useEffect(() => {
    console.log(selectedBookingTypes);
  }, [selectedBookingTypes]);

  useEffect(() => {
    console.log(selectedRooms);
  }, [selectedRooms]);

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const findItemById = (itemId) => {
    return items.find((item) => item.id === itemId);
  };

  const handleUpdateMeeting = (updatedMeeting) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedMeeting.id ? updatedMeeting : item
      )
    );
  };

  const deleteEvent = (eventId, user) => {
    axios.delete(`http://localhost:3001/events/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        user: user,
      }),
    })
      .then(response => {
        console.log('Event deleted:', response.data);
        setForceFetch(!forceFetch);
      })
      .catch(error => {
        console.log('Error deleting event:', error);
      });
  };

  const handleDeleteBookings = async () => {
    const user = localStorage.getItem("USER_IL");
    console.log("checked: ",checked);
    const deletionPromises = checked.map((eventId) => deleteEvent(eventId, user));
    await Promise.all(deletionPromises);

    // Reset the checked list
    setChecked([]);
  };

  const handleClosePopup = () => {
    setSelectedMeeting(null);
  };

  // Handle toggle for checkbox
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked([value]);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchBookingList = async () => {
    const owner = localStorage.getItem("USER_IL");
    try {
      const response = await axios({
        method: "GET",
        url: `http://localhost:3001/events?owner=sujaycjoshy@gmail.com`,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      // Return an empty array or handle this error appropriately
      return [];
    }
  };

  const handleRoomToggle = (room) => {
    setSelectedRooms(prevRooms => {
        const roomExists = prevRooms.some(prevRoom => prevRoom === room);
        if (!roomExists) {
            // Add the room if it does not exist
            return [...prevRooms, room];
        } else {
            // Filter out the room if it already exists
            return prevRooms.filter(prevRoom => prevRoom !== room);
        }
    });
};

const handleBookingTypeToggle = (bookingType) => {
    setSelectedBookingTypes(prevBookingTypes => {
        const bookingTypeExists = prevBookingTypes.some(prevBookingType => prevBookingType === bookingType);
        if (!bookingTypeExists) {
            // Add the room if it does not exist
            return [...prevBookingTypes, bookingType];
        } else {
            // Filter out the room if it already exists
            return prevBookingTypes.filter(prevBookingType => prevBookingType !== bookingType);
        }
    });
};

const getBookingList = () => {
    const data = items;
  
    // Filter data based on search, selected rooms, and selected booking types
    const filteredData = data.filter((item) => {
      const includesSearchTerm = item.summary.toLowerCase().includes(search.toLowerCase());
      const roomMatches = selectedRooms.includes(item.location);
  
      if (selectedBookingTypes.length === 0) {
        // If no booking types are selected, return the result of search and room filtering only
        return includesSearchTerm && roomMatches;
      } else {
        // Check if the booking type matches any selected booking type
        const bookingTypeMatches = selectedBookingTypes.some((bookingType) => {
          if (bookingType === 'Personal bookings') {
            // Match if the item has exactly one attendee
            return item.attendees.length === 1;
          } else if (bookingType === 'Team bookings') {
            // Match if the item has more than one attendee
            return item.attendees.length > 1;
          }
          // Add more conditions for other booking types if needed
  
          return false; // No match for unknown booking types
        });
  
        // Return the result of search, room, and booking type filtering
        return includesSearchTerm && roomMatches && bookingTypeMatches;
      }
    });
  
    // Implement pagination
    const paginatedData = filteredData.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
    
    return { data: paginatedData, totalCount: data.length };
  };

const sendEmail = async (id) => {
    console.log(id)
    const item = findItemById(id);
    const eventTitle = item.summary;
    const eventDescription = item.description;
    const eventStartTime = item.start.toString();
    const eventEndTime = item.end.toString();
    const eventLocation = item.location;
    const attendees = item.attendees;
    const attendeeList = attendees.join(", ");
    const owner = localStorage.getItem("USER_IL");

    const emailBody = `
    Dear Attendee,

    Meeting reminder:

    Title: ${eventTitle}
    Description: ${eventDescription}
    Start Time: ${eventStartTime}
    End Time: ${eventEndTime}
    Location: ${eventLocation}
    Attendees: ${attendeeList}

    SWM Innovation Lab
    `;

    console.log(emailBody);

    const subject = "Meeting Invitation";
    const emailTo = attendeeList;
    const emailFrom = owner;
    const accessToken = localStorage.getItem("GOOGLE_TOKEN");

    let email = [
      "To: " + emailTo,
      "From: " + emailFrom,
      "Subject: " + subject,
      "",
      emailBody,
    ].join("\r\n");

    // The body needs to be base64url encoded.
    const encodedEmail = btoa(email).replace(/\+/g, "-").replace(/\//g, "_");
    axios({
      method: "post",
      url: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      data: {
        raw: encodedEmail,
      },
    })
      .then((response) => {
        console.log("Email sent");
        alert("Reminder email sent to:", attendeeList)
      })
      .catch((error) => {
        console.log("Error sending email");
        console.log(error);
      });
  };
  

  return (
    <div>
    <div style={{ width: '98vw' }}>
        <Box display="flex" justifyContent="space-between" m={2} style={{ width: '100%', maxWidth: '100%', alignItems: 'center'}}>
            <TextField size="small" label="Search" variant="outlined" value={search} onChange={handleSearchChange} style={{ minWidth: '20%' }} />
            <Pagination count={Math.ceil(getBookingList().totalCount / itemsPerPage)}
                        page={page} onChange={handlePageChange}
                        style={{ marginRight: '2vw'}} />
        </Box>
    </div>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '66.66vw' }}>
            <TableContainer style={{ width: '100%', maxHeight: '80vh', overflow: 'auto', backgroundColor: 'background.paper', marginLeft: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}></TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Booking name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Location</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Date &amp; Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getBookingList().data.map((value) => {
                            const labelId = `checkbox-list-label-${value.id}`;

                            return (
                                <TableRow key={value.id} role="checkbox" onClick={() => handleMeetingClick(value)}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            edge="start"
                                            onClick={(event) => event.stopPropagation()} // Prevents row click event
                                            onChange={handleToggle(value.id)}
                                            checked={checked.indexOf(value.id) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </TableCell>
                                    <TableCell id={labelId}>{value.summary}</TableCell>
                                    <TableCell>{value.location}</TableCell>
                                    <TableCell>{value.start.toLocaleString()}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div style={{ width: '20vw', marginLeft: '150px', marginTop: '10px'}}>
            <div style={{ marginBottom: '40px' }}>
                <FilterRoom onRoomToggle={handleRoomToggle}/>
            </div>
            <div style={{ marginBottom: '40px' }}>
                <FilterBookingType onBookingTypeToggle={handleBookingTypeToggle}/>
            </div>
        </div>
    </div>
    <div style={{ marginTop: '20px' }}>
        <ButtonContainer disabled={checked.length === 0} onCancelBookings={handleDeleteBookings} />
    </div>
    <div>
        <CreateMeetingPopup open={selectedMeeting != null}
                            onClose={handleClosePopup}
                            title={selectedMeeting?.summary || ""}
                            location={selectedMeeting?.location || ""}
                            startTime={selectedMeeting?.start.toLocaleString() || ""}
                            endTime={selectedMeeting?.end.toLocaleString() || ""}
                            eventId={selectedMeeting?.id || ""}
                            onUpdate={handleUpdateMeeting} 
                            onSendEmail={sendEmail}
                            attendees={selectedMeeting?.attendees.join(", ") || ""}/>
    </div>
</div>

    );
}
