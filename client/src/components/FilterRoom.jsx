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

export default function FilterRoom({ onRoomToggle }) {
    const [checked, setChecked] = React.useState([0]);
    const [rooms, setRooms] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:3001/rooms/')
        .then(response => response.json())
        .then(data => {
            const rooms = data.map(item => ({
                id: item._id,
                name: item.name,
            }));
            setRooms(rooms);
            setChecked(rooms.map(room => room.name));
            rooms.forEach((room) => {
                onRoomToggle(room.name);
            });
        });
    }, []);

    const handleRoomToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        onRoomToggle(value);
    };

    return (
        <div style={{ border: '0.5px solid black', padding: '10px', width: '20vw' }}>
            <Typography  variant="body2" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                Rooms
            </Typography>
            <List sx={{ width: '100%', maxWidth: 250, bgcolor: 'background.paper' }}>
                {rooms.map((value) => {
                    const labelId = `checkbox-list-label-${value.id}`;

                    return (
                        <ListItem
                            key={value.id}
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleRoomToggle(value.name)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(value.name) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
