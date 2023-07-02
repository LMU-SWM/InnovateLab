import React from "react";
import {
    Checkbox,
    Chip,
    Divider,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";

function RoomTimeslotListView() {

    const getItems = () => {
        return {data: [
                {
                    id: '1',
                    room: 'Creative Room 1',
                    time: '2023-05-30T15:30:00+02:00',
                    timeStart: '2023-05-30T15:30:00+02:00',
                    timeEnd: '2023-05-30T16:30:00+02:00',
                    capacity: '5'
                },
                {
                    id: '2',
                    room: 'Creative Room 2',
                    timeStart: '2023-05-30T15:30:00+02:00',
                    timeEnd: '2023-05-30T16:30:00+02:00',
                    capacity: '5'
                },
                {
                    id: '3',
                    room: 'Creative Room 3',
                    timeStart: '2023-05-30T15:30:00+02:00',
                    timeEnd: '2023-05-30T16:30:00+02:00',
                    capacity: '5'
                },
                {
                    id: '4',
                    room: 'Creative Room 3',
                    timeStart: '2023-05-31T15:30:00+02:00',
                    timeEnd: '2023-05-30T16:30:00+02:00',
                    capacity: '5'
                },
                {
                    id: '5',
                    room: 'Creative Room 2',
                    timeStart: '2023-05-31T15:30:00+02:00',
                    timeEnd: '2023-05-30T16:30:00+02:00',
                    capacity: '5'
                }
            ]};
    };

    const groupByDate = (data) => {
        const sortedData = data.sort((a, b) => new Date(a.timeStart) - new Date(b.timeStart));
        return sortedData.reduce((groups, item) => {
            const date = new Date(item.timeStart);
            const dateKey = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.toLocaleString('default', { weekday: 'long' })}`;
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(item);
            return groups;
        }, {});
    };

    const itemsGroupedByDate = groupByDate(getItems().data);

    const StyledTableRow = styled(TableRow)`
  &:last-child td, &:last-child th {
    border: 0;
  }
`;

    return (
        <div>
            {Object.keys(itemsGroupedByDate).map(dateKey => (
                <div key={dateKey}>
                    <Divider sx={{ marginY: '10px'}}>
                        <Chip label={dateKey} color="primary" sx={{fontSize: '17px'}} />
                    </Divider>
                    <TableContainer style={{ width: '100%', maxWidth: '100%', backgroundColor: 'background.paper'}}>
                        <Table>
                            <TableBody>
                                {itemsGroupedByDate[dateKey].map((value) => {
                                    const labelId = `checkbox-list-label-${value.id}`;

                                    return (
                                        <StyledTableRow key={value.id} role="checkbox">
                                            <TableCell id={labelId}>
                                                <LocationOnIcon />
                                                {value.room}
                                            </TableCell>
                                            <TableCell>
                                                <AccessTimeIcon />
                                                {value.timeStart}-{value.timeEnd}
                                            </TableCell>
                                            <TableCell>
                                                Capacity: {value.capacity} people
                                            </TableCell>
                                            <TableCell>
                                                <Button role={undefined} variant="contained" color="primary" >
                                                    Book
                                                </Button>
                                            </TableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ))}
        </div>
    );
}

export default RoomTimeslotListView;
