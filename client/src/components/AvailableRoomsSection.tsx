import React from 'react';

interface Room {
  _id: string;
  name: string;
  capacity: number;
  items: { name: string; image: string; itemId: string }[];
  roomId: string;
}

interface AvailableRoomsSectionProps {
  rooms: Room[];
  availableRooms: Room[];
}

const AvailableRoomsSection: React.FC<AvailableRoomsSectionProps> = ({ rooms, availableRooms }) => {
  // Determine the number of rows to be displayed
  const numRows = Math.max(15, rooms.length);

  // Generate an array of row indices
  const rowIndices = Array.from(Array(numRows).keys());

  return (
    <div style={{ background: '#f1f1f1', padding: '1rem' }}>
      <h2>Rooms Status</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'lightblue' }}>
            <th>Room</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rowIndices.map((index) => {
            const room = rooms[index];
            return (
              <tr key={room ? room.roomId : index} style={{ background: index % 2 === 0 ? 'white' : 'lightblue' }}>
                <td>{room ? room.name : ''}</td>
                <td style={{ color: room && availableRooms.includes(room) ? 'green' : 'red' }}>
                  {room && availableRooms.includes(room) ? 'Available' : 'Unavailable'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AvailableRoomsSection;
