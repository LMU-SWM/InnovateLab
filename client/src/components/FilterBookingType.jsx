import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import Typography from '@mui/material/Typography';

export default function FilterBookingType() {
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

    const BookingTypes = [
        {
            id: 1,
            mame:'Personal bookings',
        },
        {
            id: 2,
            mame:'Team bookings',
        },
        ];

    return (
        <div style={{ border: '0.5px solid black', padding: '10px', width: '20vw' }}>
            <Typography  variant="body2" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                Bookings
            </Typography>
            <List sx={{ width: '100%', maxWidth: 250, bgcolor: 'background.paper' }}>
                {BookingTypes.map((value) => {
                    const labelId = `checkbox-list-label-${value.id}`;

                    return (
                        <ListItem
                            key={value}
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(value.id) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value.mame} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}