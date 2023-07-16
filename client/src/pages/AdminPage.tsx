import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import RoomSection from "../components/RoomSection";
import PublicEventsSection from "../components/PublicEventsSection";
import ManageBookingsSection from "../components/ManageBookingsSection";
import UsageAnalyticsSection from "../components/UsageAnalyticsSection";
import AvailableRoomsSection from "../components/AvailableRoomsSection";
import AvailableUsersSection from "../components/AvailableUsersSection";
import UnauthorizedPage from "./UnauthorizedPage";
import axios from "axios";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  items: { name: string; image: string; itemId: string }[];
  roomId: string;
}

interface User {
  name: string;
  userId: string;
  roles: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchRoles = async ( userId: string ) => {
    if (user) {
      console.log("userId:", userId);
      const url = `http://localhost:3001/user/${encodeURIComponent(userId)}`;
      const response = await axios.get<string[]>(url);
      const userRoles = response.data;
      console.log(userRoles);

      // Check if "Admin" role exists in the user roles array
      const isAd = userRoles.includes("Admin");
      console.log(`Is Admin: ${isAd}`);
      setIsAdmin(isAd); // check if 'Admin' role is present
    } else {
      setIsAdmin(false);
    }
  };

  //Security check
  useEffect(() => { 
    const userId = user?.sub || "";
    fetchRoles(userId);
  }, [user]);

  useEffect(() => {
  const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:3001/user/');
          const userData = await response.json();
          const usersWithRoles = await Promise.all(
            userData.map(async (user: User) => {
              const rolesResponse = await fetch(`http://localhost:3001/user/encoded(${user.userId})`);
              const rolesData = await rolesResponse.json();
              const roleNames = rolesData.map((role: Role) => role.name);
              return { ...user, roles: roleNames };
            })
          );
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
  }, [user]);

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


  

  if (isAdmin === null) {
    return <div>Checking authorization...</div>;
  }

  if (!isAdmin) {
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
