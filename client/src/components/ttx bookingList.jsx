import React, {useEffect, useState} from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TextField, Box, Pagination } from '@mui/material';
import FilterRoom from "./FilterRoom.jsx";
import FilterBookingType from "./FilterBookingType.jsx";
import ButtonContainer from "./ButtonContainer.jsx";
import FilterCreator from "./FilterCreator.jsx";
import CreateMeetingPopup from "./PopUp";
import axios from "axios";

export default function BookingList() {
    const [checked, setChecked] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const itemsPerPage = 10;

    const authToken = process.env.REACT_APP_AUTH_TOKEN;
    const calendarId = process.env.REACT_APP_CALENDAR_ID;
    const apiKey  = process.env.REACT_APP_API_KEY;
    console.log(calendarId,authToken )

    useEffect(() => {
        fetchBookingList().then((items) => setItems(items));
    }, []);

    const handleMeetingClick = (meeting) => {
        console.log('Click');
        setSelectedMeeting(meeting);
    };

    const handleUpdateMeeting = (updatedMeeting) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.id === updatedMeeting.id ? updatedMeeting : item))
        );
    };

    const deleteBooking = async (eventId) => {
        await axios({
            method: 'DELETE',
            url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}?key=${apiKey}`,
            headers: { Authorization: `Bearer ${authToken}` }
        });
    }

    const handleDeleteBookings = async () => {
        const deletionPromises = checked.map(eventId => deleteBooking(eventId));
        await Promise.all(deletionPromises);

        // Once all bookings are deleted, fetch the booking list again to update the UI.
        const updatedItems = await fetchBookingList();
        setItems(updatedItems);

        // Reset the checked list
        setChecked([]);
    }

    const handleClosePopup = () => {
        setSelectedMeeting(null)
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

        setChecked(newChecked);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    }

    const fetchBookingList = async () => {
        const response = await axios({
            method: "GET",
            url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`
        });
        return response.data.items;
    };

    const getBookingList = () => {
        const data= items;

        // FilterRoom data based on search
        const filteredData = data.filter(item => item.summary.toLowerCase().includes(search.toLowerCase()));

        // Implement pagination
        const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return {data: paginatedData, totalCount: data.length};
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
                    <TableContainer style={{ width: '100%', maxWidth: '100%', backgroundColor: 'background.paper', marginLeft: '20px' }}>
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
                                                <TableCell>{value.start.dateTime}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                </div>
                <div style={{ width: '20vw', marginLeft: '150px', marginTop: '10px'}}>
                    <div style={{ marginBottom: '40px' }}>
                        <FilterRoom />
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                        <FilterBookingType />
                    </div>
                    <div>
                        <FilterCreator/>
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
                                    startTime={selectedMeeting?.start.dateTime || ""}
                                    endTime={selectedMeeting?.end.dateTime || ""}
                                    eventId={selectedMeeting?.id || ""}
                                    calendarId={calendarId}
                                    accessToken={authToken}
                                    onUpdate={handleUpdateMeeting} />
            </div>
        </div>
    );
}