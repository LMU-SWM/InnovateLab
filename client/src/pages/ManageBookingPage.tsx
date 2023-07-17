import React from "react";
import BookingList from "../components/BookingList.jsx";
import ButtonContainer from "../components/ButtonContainer.jsx";
import { useAuth0 } from "@auth0/auth0-react";

export default function ManageBookingPage() {
  const { isAuthenticated, user } = useAuth0();
  return (
    <main style={{ padding: "1rem 0" }}>
      {isAuthenticated && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <BookingList
          usr={user} />
        </div>
      )}
    </main>
  );
}
