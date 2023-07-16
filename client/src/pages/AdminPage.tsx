import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import RoomSection from "../components/RoomSection";
import PublicEventsSection from "../components/PublicEventsSection";
import ManageBookingsSection from "../components/ManageBookingsSection";
import UsageAnalyticsSection from "../components/UsageAnalyticsSection";
import AvailableRoomsSection from "../components/AvailableRoomsSection";
import AvailableUsersSection from "../components/AvailableUsersSection";
import UnauthorizedPage from "./UnauthorizedPage";
import axios from 'axios';


interface Room {
  _id: string;
  name: string;
  capacity: number;
  items: { name: string; image: string; itemId: string }[];
  roomId: string;
}

interface EventData {
  _id: string;
  eventId: string;
  owner: string;
  team: string;
  summary: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
  attendees: string[];
  googleCalendarEventId: string;
  calendarId: string;
}

// const AdminPage: React.FC = () => {
//   const { isAuthenticated, user } = useAuth0();
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [showAddPopup, setShowAddPopup] = useState(false);
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [events, setEvents] = useState<EventData[]>([]); // Update initial state to an empty array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const [pendingEvents, setPendingEvents] = useState<EventData[]>([]);
//   const [completedEvents, setCompletedEvents] = useState<EventData[]>([]);
//   const [availableRooms, setAvailableRooms] = useState<Room[]>([]); // State for available rooms

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveIndex((prevIndex) => (prevIndex + 1) % rooms.length);
//     }, 10000);

//     return () => {
//       clearInterval(timer);
//     };
//   }, [rooms.length]);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await fetch("http://localhost:3001/rooms/");
//         if (!response.ok) {
//           throw new Error("Failed to fetch rooms");
//         }
//         const data = await response.json();
//         setRooms(data);
//         setLoading(false);
//       } catch (error: any) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch("http://localhost:3001/events/");
//         if (!response.ok) {
//           throw new Error("Failed to fetch events");
//         }
//         const data = await response.json();
//         console.log(data);
//         setEvents(data);
//       } catch (error: any) {
//         setError(error.message);
//       }
//     };

//     if (isAuthenticated) {
//       fetchEvents();
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     const currentDate = new Date();
//     const currentDay = currentDate.getDate();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();

//     const pendingEventsList = events.filter((event) => {
//       const eventDate = new Date(event.startDateTime);
//       const eventDay = eventDate.getDate();
//       const eventMonth = eventDate.getMonth();
//       const eventYear = eventDate.getFullYear();

//       return (
//         eventDay === currentDay &&
//         eventMonth === currentMonth &&
//         eventYear === currentYear
//       );
//     });

//     setPendingEvents(pendingEventsList);

//     const completedEventsList = events.filter((event) => {
//       const eventDate = new Date(event.endDateTime);
//       const eventDay = eventDate.getDate();
//       const eventMonth = eventDate.getMonth();
//       const eventYear = eventDate.getFullYear();

//       return (
//         eventDay === currentDay &&
//         eventMonth === currentMonth &&
//         eventYear === currentYear
//       );
//     });

//     setCompletedEvents(completedEventsList);
//     // Find available rooms
//     const getAvailableRooms = () => {
//       const currentDateTime = currentDate.getTime();

//       return rooms.filter((room) => {
//         const conflictingEvent = events.find((event) => {
//           const eventStartDateTime = new Date(event.startDateTime).getTime();
//           const eventEndDateTime = new Date(event.endDateTime).getTime();
//           return (
//             event.location === room.name &&
//             eventStartDateTime <= currentDateTime &&
//             eventEndDateTime >= currentDateTime
//           );
//         });

//         return !conflictingEvent;
//       });
//     };

//     setAvailableRooms(getAvailableRooms());
//   }, [events, rooms]);

//   const handleSetOfflineTime = () => {
//     // Add logic to set up lab off-line time
//     console.log("Setting up lab off-line time");
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <main style={{ padding: "1rem 0" }}>
//       {isAuthenticated && (
//         <div style={{ display: "flex", flexDirection: "column" }}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(3, 1fr)",
//               gridGap: "1px",
//             }}
//           >
//             <RoomSection rooms={rooms} />
//             <PublicEventsSection events={events} />

//             <ManageBookingsSection
//               pendingEvents={pendingEvents}
//               completedEvents={completedEvents}
//               onSetOfflineTime={handleSetOfflineTime}
//             />

//             <div style={{ background: "#f1f1f1", padding: "1rem" }}>
//               <h2>User Roles</h2>
//               {/* Add content for User Roles section */}
//             </div>
//             <AvailableRoomsSection rooms={rooms} availableRooms={availableRooms} />
//             <UsageAnalyticsSection events={events} />
//           </div>
//         </div>
//       )}
//     </main>
//   );
// };
// export default AdminPage;

export default function AdminPage() {
  const { isAuthenticated, user } = useAuth0();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [adminEvents, setAdminEvents] = useState<EventData[]>([]); // Update initial state to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [pendingEvents, setPendingEvents] = useState<EventData[]>([]);
  const [completedEvents, setCompletedEvents] = useState<EventData[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]); // State for available rooms

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % rooms.length);
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [rooms.length]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3001/rooms/");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setRooms(data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/events/");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        //console.log(data);
        setEvents(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/events?owner=ADMIN");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        //console.log(data);
        setAdminEvents(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const pendingEventsList = events.filter((event) => {
      const eventDate = new Date(event.startDateTime);
      const eventDay = eventDate.getDate();
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();

      return (
        eventDay === currentDay &&
        eventMonth === currentMonth &&
        eventYear === currentYear
      );
    });

    setPendingEvents(pendingEventsList);

    const completedEventsList = events.filter((event) => {
      const eventDate = new Date(event.endDateTime);
      const eventDay = eventDate.getDate();
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();

      return (
        eventDay === currentDay &&
        eventMonth === currentMonth &&
        eventYear === currentYear
      );
    });

    setCompletedEvents(completedEventsList);
    // Find available rooms
    const getAvailableRooms = () => {
      const currentDateTime = currentDate.getTime();

      return rooms.filter((room) => {
        const conflictingEvent = events.find((event) => {
          const eventStartDateTime = new Date(event.startDateTime).getTime();
          const eventEndDateTime = new Date(event.endDateTime).getTime();
          return (
            event.location === room.name &&
            eventStartDateTime <= currentDateTime &&
            eventEndDateTime >= currentDateTime
          );
        });

        return !conflictingEvent;
      });
    };

    setAvailableRooms(getAvailableRooms());
  }, [events, rooms]);

  const handleSetOfflineTime = () => {
    // Add logic to set up lab off-line time
    //console.log("Setting up lab off-line time");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  //console.log(user);

 // Make an API call to get user roles
 async function getUserRoles(userId: string) {
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkxuWWp2d0pLb2lXbXJESXZGRWxMNyJ9.eyJpc3MiOiJodHRwczovL2Rldi1nazFtd3E3dnpzdDUwemhzLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnVlgxZ1htbHUzNjFNaVZrNHE1RURCVWJqWmFiQmtTM0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtZ2sxbXdxN3Z6c3Q1MHpocy5ldS5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY4ODkzNjQzOCwiZXhwIjoxNjg5MDIyODM4LCJhenAiOiJnVlgxZ1htbHUzNjFNaVZrNHE1RURCVWJqWmFiQmtTMyIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVycyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVycyBjcmVhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgY3JlYXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uc19zdW1tYXJ5IGNyZWF0ZTphY3Rpb25zX2xvZ19zZXNzaW9ucyBjcmVhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgdXBkYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgZGVsZXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDpjbGllbnRfY3JlZGVudGlhbHMgY3JlYXRlOmNsaWVudF9jcmVkZW50aWFscyB1cGRhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIGRlbGV0ZTpjbGllbnRfY3JlZGVudGlhbHMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.V5s4s6U9VXD2_N8pm7KxdFIDoJiWOOiTGkyI373GsRR3sDaxCU8NAPE-PQpXBqUBK0sPFi75NlyYzg8krk4RCDPnBw62wuAPOZg9vhtehrtUibnPtJ5HOlUYMdS2dUhzcnaIOIJnwAQOQnntdjmmnrY3pL0EbPS44j-oEBcTthLG-fnFs2AED8wlDK3AcHUYYGXEnnufZNVLhqqdbP3t3lvEQtONnffsFR2xJsrACQeYEpghjJ2z-rDpkr2PFqZelVl3T6eyjX8PlCoIbpR1aFNPJPtkAtz6J1edyhdvgw3W80K9kWybPi9lYGdl3XbYOBQORVkb9kBi18APvIiWxg"; // Access token for the Management API
  const url = `https://dev-gk1mwq7vzst50zhs.eu.auth0.com/api/v2/users/${userId}/roles`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log(response);
    const roles = response.data.roles;
    return roles;
  } catch (error) {
    console.error("Failed to retrieve user roles:", error);
    return [];
  }
}

  //Security check
  if (user) {
    const userId = user.sub || ""; // Replace with the actual user ID
    getUserRoles(userId)
      .then((roles) => {
        //console.log("User roles:", roles);
        if(!roles.includes("Admin"))
        {
          return <UnauthorizedPage />;
        }
      })
      .catch((error) => {
        //console.error("Error:", error);
        return <UnauthorizedPage />;
      });
  }
  else{
    return <UnauthorizedPage />;
  }

  return (
    <main style={{ padding: "1rem 0" }}>
      {isAuthenticated && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridGap: "1px",
            }}
          >
            <RoomSection rooms={rooms} />
            <PublicEventsSection events={adminEvents} />

            <ManageBookingsSection
              rooms={rooms}
              pendingEvents={pendingEvents}
              completedEvents={completedEvents}
              onSetOfflineTime={handleSetOfflineTime}
            />
            <AvailableUsersSection />
            <AvailableRoomsSection
              rooms={rooms}
              availableRooms={availableRooms}
            />
            <UsageAnalyticsSection events={events} />
          </div>
        </div>
      )}
    </main>
  );
}
