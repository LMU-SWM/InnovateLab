const { google } = require('googleapis');

const getServiceAccountAuth = async () => {
  try {
    const auth = await google.auth.getClient({
      keyFile: './auth.json',
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    return auth;
  } catch (error) {
    console.error('Error authenticating service account:', error);
    throw error;
  }
};

module.exports = {
  getServiceAccountAuth,
};
