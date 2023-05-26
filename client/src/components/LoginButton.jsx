import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'

const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0;
    return (
        !isAuthenticated && (
            <button class="rounded-full bg-blue-500 text-white px-4 py-2" onClick={() => loginWithRedirect()} >Sign In</button>
      )
  )
}

export default LoginButton