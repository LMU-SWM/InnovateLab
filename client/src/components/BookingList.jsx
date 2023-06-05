import axios from "axios";
import React, { useState, useEffect } from "react";
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

const calendarId = process.env.REACT_APP_CALENDAR_ID;
const apiKey = process.env.REACT_APP_API_KEY;

export default function BookingList() {
  const [checked, setChecked] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [bookingData, setBookingData] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBookingList();
        setBookingData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getBookingList = () => {
    return getPublicCalendarEvents(apiKey, calendarId)
      .then((mappedEvents) => {
        const data = mappedEvents.map((value) => {
          return {
            Id: value.Id,
            BookingName: value.BookingName,
            DateTime: value.DateTime,
            Location: value.Location,
          };
        });

        console.log(data);

        // FilterRoom data based on search
        const filteredData = data.filter((item) =>
          item.BookingName.toLowerCase().includes(search.toLowerCase())
        );

        // Implement pagination
        const paginatedData = filteredData.slice(
          (page - 1) * itemsPerPage,
          page * itemsPerPage
        );

        return { data: paginatedData, totalCount: data.length };
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getPublicCalendarEvents = (apiKey, calendarId) => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;

    return axios
      .get(url)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to fetch events from Google Calendar API.");
        }

        const data = response.data;
        const events = data.items;

        const mappedEvents = events.map((event) => {
          return {
            Id: event.id,
            BookingName: event.summary,
            DateTime: event.start.dateTime,
            Location: event.location,
          };
        });

        return mappedEvents;
      })
      .catch((error) => {
        console.error("Error fetching events from Google Calendar:", error);
        return [];
      });
  };

  return (
    <div>
      <div style={{ width: "98vw" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          m={2}
          style={{ width: "100%", maxWidth: "100%", alignItems: "center" }}
        >
          <TextField
            size="small"
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            style={{ minWidth: "20%" }}
          />
          <Pagination
            count={Math.ceil(getBookingList().totalCount / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            style={{ marginRight: "2vw" }}
          />
        </Box>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <div style={{ width: "66.66vw" }}>
          <TableContainer
            style={{
              width: "100%",
              maxWidth: "100%",
              backgroundColor: "background.paper",
              marginLeft: "20px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}></TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Booking name
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Location</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Date &amp; Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingData.data &&
                  bookingData.data.map((value) => {
                    const labelId = `checkbox-list-label-${value.Id}`;

                    return (
                      <TableRow key={value.Id} role="checkbox">
                        <TableCell padding="checkbox">
                          <Checkbox
                            edge="start"
                            onClick={(event) => event.stopPropagation()} // Prevents row click event
                            onChange={handleToggle(value.Id)}
                            checked={checked.indexOf(value.Id) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell id={labelId}>{value.BookingName}</TableCell>
                        <TableCell>{value.Location}</TableCell>
                        <TableCell>{value.DateTime}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div style={{ width: "20vw", marginLeft: "150px", marginTop: "10px" }}>
          <div style={{ marginBottom: "40px" }}>
            <FilterRoom />
          </div>
          <div style={{ marginBottom: "40px" }}>
            <FilterBookingType />
          </div>
          <div>
            <FilterCreator />
          </div>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <ButtonContainer disabled={checked.length === 0} />
      </div>
    </div>
  );
}
