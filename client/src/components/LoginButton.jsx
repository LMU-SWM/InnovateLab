import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'

//the login button is set up with the Auth0 authentication where you can only login when you are not authenticated
const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0;
    return (
        !isAuthenticated && (
            <button class="rounded-full bg-blue-500 text-white px-4 py-2" onClick={() => loginWithRedirect()} >Sign In</button>
      )
  )
}

export default LoginButton