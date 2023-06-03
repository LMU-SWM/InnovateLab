import { useAuth0 } from "@auth0/auth0-react";
import { Grid, Avatar, TextField, Button } from "@mui/material";

function Profile() {
  const { isAuthenticated, user } = useAuth0();

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
