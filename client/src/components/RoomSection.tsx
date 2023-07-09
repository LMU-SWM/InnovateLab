import React, { useState } from 'react';
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
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Room {
  _id: string;
  name: string;
  capacity: number;
  items: { name: string; image: string }[];
  roomId: string;
}

interface RoomSectionProps {
  rooms: Room[];
}

const RoomSection: React.FC<RoomSectionProps> = ({ rooms }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    capacity: 0,
    items: [{ name: '', image: '' }],
  });
  const [editedRoomData, setEditedRoomData] = useState({
    name: rooms[activeIndex].name,
    capacity: rooms[activeIndex].capacity,
    items: [...rooms[activeIndex].items],
  });

  const handleNextRoom = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % rooms.length);
  };

  const handlePreviousRoom = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + rooms.length) % rooms.length);
  };

  const handleEditRoom = () => {
    setShowEditPopup(true);
    setEditedRoomData(rooms[activeIndex]);
  };

  const handleAddRoom = () => {
    setShowAddPopup(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
  };

  // const handleAddRoomSubmit = () => {
  //   // Send a POST request to the server with the new room data
  //   console.log(newRoomData);
  //   fetch('http://localhost:3001/rooms/', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(newRoomData),
  //   })
  //     .then((response) => {
  //       // Handle the response from the server
  //       if (response.ok) {
  //         // Room was successfully added
  //         setShowAddPopup(false);
  //       } else {
  //         // Handle error
  //         console.error('Error adding room');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error adding room', error);
  //     });
  // };
const handleAddRoomSubmit = () => {
  // Send a POST request to the server with the new room data
  console.log(newRoomData);
  fetch('http://localhost:3001/rooms/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRoomData),
  })
    .then((response) => {
      // Handle the response from the server
      if (response.ok) {
        // Room was successfully added
        setShowAddPopup(false);
        //window.location.reload(); // Force page reset
      } else {
        // Handle error
        console.error('Error adding room');
      }
    })
    .catch((error) => {
      console.error('Error adding room', error);
    });
};

  const handleNewRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewItemChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = event.target;
    setNewRoomData((prevData) => {
      const newItems = [...prevData.items];
      newItems[index] = { ...newItems[index], [name]: value };
      return {
        ...prevData,
        items: newItems,
      };
    });
  };

  const handleAddNewItem = () => {
    setNewRoomData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { name: '', image: '' }],
    }));
  };

  const handleEditRoomSubmit = () => {
    // Send a PUT request to the server with the edited room data
    fetch(`http://localhost:3001/rooms/${rooms[activeIndex].roomId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedRoomData),
    })
      .then((response) => {
        // Handle the response from the server
        if (response.ok) {
          // Room was successfully edited
          setShowEditPopup(false);
          // Perform any necessary updates or actions
        } else {
          // Handle error
          console.error('Error editing room');
        }
      })
      .catch((error) => {
        console.error('Error editing room', error);
      });
  };

  const handleEditRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditItemChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = event.target;
    setEditedRoomData((prevData) => {
      const newItems = [...prevData.items];
      newItems[index] = { ...newItems[index], [name]: value };
      return {
        ...prevData,
        items: newItems,
      };
    });
  };

  const addItem = () => {
    setEditedRoomData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { name: '', image: '' }],
    }));
  };

  const deleteItem = (index: number) => {
    setEditedRoomData((prevData) => {
      const newItems = [...prevData.items];
      newItems.splice(index, 1);
      return {
        ...prevData,
        items: newItems,
      };
    });
  };

  return (
    <div style={{ background: '#f1f1f1', padding: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Rooms</h2>
        <div>
          <IconButton onClick={handlePreviousRoom}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={handleNextRoom}>
            <NavigateNextIcon />
          </IconButton>
        </div>
      </div>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {rooms[activeIndex].name}
          </Typography>
          <Typography color="text.secondary">Capacity: {rooms[activeIndex].capacity}</Typography>
          <Typography color="text.secondary">
            Tools in room: {rooms[activeIndex].items.map((item) => item.name).join(', ')}
          </Typography>
        </CardContent>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <IconButton onClick={handleEditRoom}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleAddRoom} color="primary">
          <AddIcon />
        </IconButton>
      </div>

      {/* Edit Room Popup */}
      <Dialog open={showEditPopup} onClose={closeEditPopup} maxWidth="md" fullWidth>
        <DialogTitle>Edit Room: {rooms[activeIndex].name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editedRoomData.name}
            onChange={handleEditRoomChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            type="number"
            name="capacity"
            value={editedRoomData.capacity}
            onChange={handleEditRoomChange}
            fullWidth
            margin="normal"
          />
          <Typography variant="subtitle1">Items:</Typography>
          {editedRoomData.items.map((item, index) => (
            <div key={index}>
              <TextField
                label="Name"
                name="name"
                value={item.name}
                onChange={(event) => handleEditItemChange(event as React.ChangeEvent<HTMLInputElement>, index)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Image"
                name="image"
                value={item.image}
                onChange={(event) => handleEditItemChange(event as React.ChangeEvent<HTMLInputElement>, index)}
                fullWidth
                margin="normal"
              />
              <IconButton onClick={() => deleteItem(index)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <Button onClick={addItem} variant="outlined" color="primary">
            Add Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditPopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditRoomSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>


      {/* Add Room Popup */}
      <Dialog open={showAddPopup} onClose={closeAddPopup} maxWidth="md" fullWidth>
        <DialogTitle>Add Room</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newRoomData.name}
            onChange={handleNewRoomChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            type="number"
            name="capacity"
            value={newRoomData.capacity}
            onChange={handleNewRoomChange}
            fullWidth
            margin="normal"
          />
          <Typography variant="subtitle1">Items:</Typography>
          {newRoomData.items.map((item, index) => (
            <div key={index}>
              <TextField
                label="Name"
                name="name"
                value={item.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleNewItemChange(event, index)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Image"
                name="image"
                value={item.image}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleNewItemChange(event, index)
                }
                fullWidth
                margin="normal"
              />
            </div>
          ))}
          <Button onClick={handleAddNewItem} variant="outlined" color="primary">
            Add Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddPopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddRoomSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomSection;
