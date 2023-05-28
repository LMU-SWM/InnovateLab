import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TextField, Box, Pagination } from '@mui/material';
import FilterRoom from "./FilterRoom.jsx";
import FilterBookingType from "./FilterBookingType.jsx";
import ButtonContainer from "./ButtonContainer.jsx";
import FilterCreator from "./FilterCreator.jsx";

export default function BookingList() {
    const [checked, setChecked] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

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


    const getBookingList = () => {
        const data = [
            {
                Id: '1',
                BookingName: 'Meeting 1',
                DateTime: 'May 27, 2023 9:00 AM',
                Location: 'Conference Room A',
            },
            {
                Id: '2',
                BookingName: 'Meeting 2',
                DateTime: 'May 27, 2023 2:00 PM',
                Location: 'Conference Room B',
            },
            {
                Id: '3',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '4',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '5',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '6',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '7',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '8',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '9',
                BookingName: 'Meeting 1',
                DateTime: 'May 27, 2023 9:00 AM',
                Location: 'Conference Room A',
            },
            {
                Id: '10',
                BookingName: 'Meeting 2',
                DateTime: 'May 27, 2023 2:00 PM',
                Location: 'Conference Room B',
            },
            {
                Id: '11',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '12',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '13',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '14',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '15',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            {
                Id: '16',
                BookingName: 'Meeting 3',
                DateTime: 'May 28, 2023 10:30 AM',
                Location: 'Conference Room C',
            },
            // Add more objects as needed
        ]

        // FilterRoom data based on search
        const filteredData = data.filter(item => item.BookingName.toLowerCase().includes(search.toLowerCase()));

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
                                                        inputProps={{ 'aria-labelledby': labelId }}
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
                <ButtonContainer disabled={checked.length === 0} />
            </div>
        </div>
    );
    }
    