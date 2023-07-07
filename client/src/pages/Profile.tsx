import { useAuth0 } from "@auth0/auth0-react";
import { Grid, Avatar, TextField, Button } from "@mui/material";
import { useEffect } from "react";
import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";

function Profile() {
  // const { isAuthenticated, user, getIdTokenClaims } = useAuth0();

  // useEffect(() => {
  //   const getTokenAndSave = async () => {
  //     if (isAuthenticated) {
  //       const idTokenClaims = await getIdTokenClaims();
  //       if (idTokenClaims && idTokenClaims.__raw) {
  //         const userAuth0Token = idTokenClaims.__raw;
  //         localStorage.setItem('USER_AUTH0_TOKEN', userAuth0Token);
  //         console.log('User token stored:', userAuth0Token);

  //         try {
  //           const googleToken = await auth0Client.getTokenSilently({
  //             audience: 'https://YOUR_AUTH0_DOMAIN/api/v2/',
  //             scope: 'openid profile email',
  //           });
  //           localStorage.setItem('GOOGLE_ACCESS_TOKEN', googleToken);
  //           console.log('Google access token stored:', googleToken);
  //         } catch (error) {
  //           console.error('Error: Failed to get Google access token', error);
  //         }
  //       } else {
  //         console.error('Error: ID token claims not available');
  //       }
  //     }
  //   };
  //   getTokenAndSave();
  // }, [isAuthenticated, getIdTokenClaims]);
  const { isAuthenticated, user, getIdTokenClaims, loginWithRedirect } =
    useAuth0();
  let auth0Client: Auth0Client;

  useEffect(() => {
    const configureClient = async () => {
      auth0Client = await createAuth0Client({
        domain: "dev-gk1mwq7vzst50zhs.eu.auth0.com",
        client_id: "LSGAVOEPkUZKjenwFeHJYaQKLQG1Ayo1",
        redirect_uri: "http://localhost:3000/react-auth0/profile", // Your redirect URI
        // The audience represents the identifier of your API
        audience: "https://dev-gk1mwq7vzst50zhs.eu.auth0.com/api/v2/",
        // This will request the tokens with an explicit scope
        scope: "openid profile email",
      });

      const getTokenAndSave = async () => {
        const idTokenClaims = await getIdTokenClaims();
        if (idTokenClaims && idTokenClaims.__raw) {
          const userAuth0Token = idTokenClaims.__raw;
          localStorage.setItem("USER_AUTH0_TOKEN", userAuth0Token);
          console.log("User token stored:", userAuth0Token);

          try {
            const googleToken = await auth0Client.getTokenSilently({
              audience: "https://dev-gk1mwq7vzst50zhs.eu.auth0.com/api/v2/",
              scope: "https://www.googleapis.com/auth/calendar.readonly",
            });
            localStorage.setItem("GOOGLE_ACCESS_TOKEN", googleToken);
            console.log("Google access token stored:", googleToken);
          } catch (error) {
            console.error("Error: Failed to get Google access token", error);
          }
        } else {
          console.error("Error: ID token claims not available");
        }
      };
      getTokenAndSave();
    };

    configureClient();
  }, [isAuthenticated, getIdTokenClaims, loginWithRedirect]);

  return (
    <main style={{ padding: "1rem 0" }}>
      {isAuthenticated && (
        <Grid container>
          <Grid container justifyContent="center">
            <Grid item sx={{ m: 1 }}>
              <Avatar
                alt={user?.email}
                src={user?.picture}
                sx={{ width: 75, height: 75 }}
              />
            </Grid>
            <Grid item xs={12} sx={{ m: 1 }}>
              <TextField
                id="email"
                label="Email"
                value={user?.email}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sx={{ m: 1 }}>
              <TextField
                id="nickname"
                label="Nickname"
                value={user?.nickname}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </main>
  );
}

export default Profile;
