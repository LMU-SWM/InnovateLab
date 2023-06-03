import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export default function IndexPage() {
  const { isAuthenticated, user } = useAuth0();
  return (
    <main style={{ padding: "1rem 0" }}>
      {isAuthenticated && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          This is the Index page
        </div>
      )}
    </main>
  );
}
