import * as React from 'react';
import Button from '@mui/material/Button';

export default function ButtonContainer({disabled, onCancelBookings}) {
    return (
        <div style={{ width: '66.66vw', display: 'flex', justifyContent: 'space-between' }}>
            <Button disabled={disabled} variant="contained" style={{ marginRight: 'auto', marginLeft: '2px' }}>
                Add to Outlook
            </Button>
            <Button disabled={disabled} variant="contained" style={{ marginLeft: 'auto', marginRight: '2px' }} onClick={onCancelBookings}>
                Cancel booking
            </Button>
        </div>
    );
}