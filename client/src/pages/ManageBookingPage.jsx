import React from 'react';
import BookingList from '../components/BookingList.jsx';
import ButtonContainer from "../components/ButtonContainer.jsx";

export default function ManageBookingPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <BookingList />
        </div>
    );
}