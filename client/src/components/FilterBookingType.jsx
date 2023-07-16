import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

export default function FilterBookingType({ onBookingTypeToggle }) {
  const [checked, setChecked] = React.useState([]);
  const [bookingTypes, setBookingTypes] = React.useState([]);

  React.useEffect(() => {
    const bookingTypesData = [
      {
        id: 1,
        name: "Personal bookings",
      },
      {
        id: 2,
        name: "Team bookings",
      },
    ];

    setBookingTypes(bookingTypesData);
    setChecked(bookingTypesData.map((bookingType) => bookingType.name));
    bookingTypesData.forEach((bookingType) => {
        onBookingTypeToggle(bookingType.name);
    });
  }, []);

  const handleBookingTypeToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    onBookingTypeToggle(value);
  };

  return (
    <div
      style={{ border: "0.5px solid black", padding: "10px", width: "20vw" }}
    >
      <Typography
        variant="body2"
        style={{ fontWeight: "bold", fontSize: "14px" }}
      >
        BookingTypes
      </Typography>
      <List sx={{ width: "100%", maxWidth: 250, bgcolor: "background.paper" }}>
        {bookingTypes.map((value) => {
          const labelId = `checkbox-list-label-${value.id}`;

          return (
            <ListItem key={value.id} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleBookingTypeToggle(value.name)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(value.name) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
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
