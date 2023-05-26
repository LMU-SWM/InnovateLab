import React from 'react';
import BookingList from '../components/BookingList.jsx';
import CreateMeetingPopup from "../components/PopUp.jsx";

export default function ManageBookingPage() {
    return (
        <div>
            <h1>Manage Existing Booking Page</h1>
            <BookingList />
            <CreateMeetingPopup />
        </div>
    );
}