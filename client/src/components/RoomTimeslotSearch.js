import React, { Component } from 'react';
import {
    Button,
    Container,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Avatar, OutlinedInput, SelectChangeEvent, ListSubheader
} from "@mui/material";
import RoomTimeslotListView from "./RoomTimeslotListView";
import Autocomplete from '@mui/material/Autocomplete';
import Stack from "@mui/material/Stack";

const durationOptions = [
    { label: '30 min'},
    { label: '1 hour'},
    { label: '2 hours' },
    { label: '3 hours'},
    { label: '4 hours' },
    { label: '5 hours' },
    { label: '6 hours' },
    { label: '7 hours' },
    { label: 'full day' },
];

const equipmentOptions = [
    { label: 'TV'},
    { label: 'Whiteboard'},
    { label: '3d Printer' },
    { label: 'Kanban board'},
    { label: 'Projector' },
];

const timeslotOptions = [
    { label: 'Next available option'},
    { label: 'Next week'},
    { label: 'In two weeks' },
    { label: 'In three weeks'},
    { label: 'In a month' },
];


class RoomTimeslotSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            duration: 0,
            equipment: [],
            participants: [],
        };
    }

    handleChange = (name) => (event) => {
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
    };

    handleParticipantsChange = (value) => {
        this.setState({
            ...this.state,
            ['participants']: value,
        });
    }

    removeParticipant = (participantToRemove) => {
        this.setState(prevState => {
            const participants = prevState.participants.filter(participant => participant !== participantToRemove);
            return { participants };
        });
        ;
    };

    render() {
        const participants = ["Michael Soul", "Veronika Kori", "Participant3"]; // replace this with actual participant list


        return (
            <Stack direction="column">
                <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ backgroundColor: '#8EBCE9', borderRadius: '10px', padding: '20px', width: '90%', maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Stack direction="row" spacing={2}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={timeslotOptions}
                            sx={{ width: 235 }}
                            renderInput={(params) => <TextField {...params} style={{backgroundColor: 'white', borderRadius: '4px'}} label="Time slot" />}
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={durationOptions}
                            sx={{ width: 150 }}
                            renderInput={(params) => <TextField {...params} style={{backgroundColor: 'white', borderRadius: '4px'}} label="Duration" />}
                        />

                        <FormControl>
                            <Select
                                sx={{ width: 235 }}
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                style={{backgroundColor: 'white', borderRadius: '4px'}}
                                value={this.state.equipment}
                                onChange={this.handleChange('equipment')}
                                input={<OutlinedInput id="select-multiple-chip" />}
                            >
                                <ListSubheader>Equipment</ListSubheader>
                                {equipmentOptions.map((equipment) => (
                                    <MenuItem
                                        key={equipment.label}
                                        value={equipment.label}
                                    >
                                        {equipment.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '35ch', maxHeight: '1ch' }}>
                            <Autocomplete
                                multiple
                                limitTags={2}
                                options={participants}
                                getOptionLabel={(option) => option}
                                defaultValue={[]}
                                value={this.state.participants}
                                renderTags={(tagValue) =>
                                    tagValue.map((option, index) => (
                                        <Avatar sx={{ marginRight: '2px'}} onClick={() => this.removeParticipant(option)}>{option[0]}</Avatar>
                                    ))
                                }
                                onChange={(event, newValue) => {
                                    this.handleParticipantsChange(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" style={{backgroundColor: 'white', borderRadius: '4px'}} label="Participants" placeholder="Participants" />
                                )}
                                name="participants"
                            />
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
