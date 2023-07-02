import React, { Component } from 'react';
import {Button, Container, TextField, FormControl, InputLabel, Select, MenuItem, Box, Grid} from "@mui/material";
import RoomTimeslotListView from "./RoomTimeslotListView";
import Stack from "@mui/material/Stack";

class RoomTimeslotSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            duration: 0,
            equipment: "",
            participants: "",
        };
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        });
    };

    render() {
        const equipments = ["Equipment1", "Equipment2", "Equipment3"]; // replace this with actual equipment list
        const participants = ["Participant1", "Participant2", "Participant3"]; // replace this with actual participant list

        return (
            <Stack direction="column">
                <Box
                    display="flex"
                    justifyContent="center"
                    // alignItems="center"
                >
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Duration (h)"
                            name="duration"
                            type="number"
                            value={this.state.duration}
                            onChange={this.handleChange}
                            sx={{ width: '10ch'}}
                        />
                        <FormControl sx={{ width: '25ch' }}>
                            <InputLabel>Equipment</InputLabel>
                            <Select
                                name="equipment"
                                value={this.state.equipment}
                                onChange={this.handleChange}
                            >
                                {equipments.map((equipment, index) => (
                                    <MenuItem key={index} value={equipment}>
                                        {equipment}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: '25ch' }}>
                            <InputLabel>Participants</InputLabel>
                            <Select
                                name="participants"
                                value={this.state.participants}
                                onChange={this.handleChange}
                            >
                                {participants.map((participant, index) => (
                                    <MenuItem key={index} value={participant}>
                                        {participant}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" >
                            Apply filters
                        </Button>
                    </Stack>
                </Box>
                <Box sx={{ margin: "20px"}}>
                    <RoomTimeslotListView />
                </Box>
            </Stack>

            // <Grid container spacing={0}>
            //     <Grid xs={12}>
            //     </Grid>
            //     <Grid xs={12}>

            //     </Grid>
            // </Grid>
        );
    }
}

export default RoomTimeslotSearch;
