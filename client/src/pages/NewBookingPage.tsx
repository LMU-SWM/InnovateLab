import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import AddCalendar from "../components/AddCalendar.jsx"

export default function NewBookingPage() {
  //return ();
  const { isAuthenticated, user } = useAuth0();

  return (
    <main style={{ padding: "1rem 0" }}>
      {isAuthenticated && (
        <div>
        <AddCalendar />
      </div>
      )}
    </main>
  );
}
