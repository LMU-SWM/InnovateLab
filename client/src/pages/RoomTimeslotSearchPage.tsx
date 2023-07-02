import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import RoomTimeslotSearch from "../components/RoomTimeslotSearch";

export default function RoomTimeslotSearchPage() {
    //return ();
    const { isAuthenticated, user } = useAuth0();

    return (
        <main style={{ padding: "1rem 0" }}>
            {isAuthenticated && (
                <div>
                    <RoomTimeslotSearch />
                </div>
            )}
        </main>
    );
}
