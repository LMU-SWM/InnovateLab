import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox() {
    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={top100Films}
            sx={{ width: 150 }}
            renderInput={(params) => <TextField {...params} label="Duration" />}
        />
    );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
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