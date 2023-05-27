import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';

export default function CheckboxList() {
    const [checked, setChecked] = React.useState([0]);

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

    const getBookingList = (skip, take) => {
        return [
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
            // Add more objects as needed
        ].slice(skip, skip + take)
    };


    return (
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
                        {getBookingList(0, 5).map((value) => {
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
    );
    }