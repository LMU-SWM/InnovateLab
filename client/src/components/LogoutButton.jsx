import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    //Logout button only logs this to the console for now
    console.log('Logout clicked');
  };

  return (
    <button className="rounded-full bg-blue-500 text-white px-4 py-2" onClick={handleLogout}>
      Sign Out
    </button>
  );
};

export default LogoutButton;


//logout button below uses the auth0 authentication
/*
import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'

//logout button only works if you are authenticated
const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0;
    return (
        isAuthenticated && (
            <button class="rounded-full bg-blue-500 text-white px-4 py-2" onClick={() => logout()} >Sign Out</button>
        )
    )
}

export default LogoutButton*/