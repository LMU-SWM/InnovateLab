import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';

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
            <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
                <ListItem disablePadding>
                    <ListItemText
                        primary={
                            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                <span style={{ marginRight: '64px' }}>Booking name</span>
                                <span style={{ marginRight: '64px' }}>Date &amp; Time</span>
                                <span>Location</span>
                            </div>
                        }
                    />
                </ListItem>


                {getBookingList().map((value) => {
                    const labelId = `checkbox-list-label-${value.Id}`;

                    // Additional information for each line item

                    return (
                        <ListItem
                            key={value}
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(value.Id)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(value.Id) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '64px' }}>{value.BookingName}</span>
                                            <span style={{ marginRight: '64px' }}>{value.DateTime}</span>
                                            <span>{value.Location}</span>
                                        </div>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}