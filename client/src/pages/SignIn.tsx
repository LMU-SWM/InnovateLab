import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

function SignIn() {
  const { loginWithRedirect } = useAuth0();

  const handleLoginWithGoogle = () => {
    loginWithRedirect({
      connection: 'google-oauth2', // Specify the connection for Google login
      scope: 'openid profile email https://www.googleapis.com/auth/calendar.readonly', // Specify the desired scopes for Google API access
    });
  };

  return (
    <main style={{ padding: '1rem 0' }}>
      <Grid container>
        <Grid container justifyContent="center">
          <Button variant="contained" onClick={handleLoginWithGoogle}>Sign In with Google</Button>
        </Grid>
      </Grid>
    </main>
  );
}

export default SignIn;
