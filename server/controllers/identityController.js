const axios = require("axios");
const express = require("express");

const router = express.Router();

module.exports = (db) => {
  // Step 1: Get a Token
  async function getManagementAPIToken() {
    try {
      const response = await axios.post(
        "https://dev-gk1mwq7vzst50zhs.eu.auth0.com/oauth/token",
        {
          grant_type: "client_credentials",
          client_id: "gVX1gXmlu361MiVk4q5EDBUbjZabBkS3",
          client_secret: "yOgopi2u3sgL9yxQcqJein1Z6W7ixkmqTcPR7dBW1qvY6WZ0ahAvAxwfhvazKGwb",
          audience: "https://dev-gk1mwq7vzst50zhs.eu.auth0.com/api/v2/",
        }
      );
      console.log("STEP 1:", response.data);
      return response.data.access_token;
    } catch (error) {
      console.error("Failed to get Management API token:", error);
      throw error;
    }
  }

  // Step 2: Get the full User Profile
  async function getUserProfile(accessToken, userId) {
    try {
      const response = await axios.get(
        `https://dev-gk1mwq7vzst50zhs.eu.auth0.com/api/v2/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("STEP 2:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to get user profile:", error);
      throw error;
    }
  }

  // Step 3: Extract the IdP Access Token
  function extractIdPAccessToken(userProfile, providerName) {
    const identity = userProfile.identities.find(
      (identity) => identity.provider === providerName
    );
    return identity ? identity.access_token : null;
  }

  // Controller route
  const getIdentity = async (req, res) => {
    try {
      const managementAccessToken = await getManagementAPIToken();
      const userId = req.params.userId;
      const userProfile = await getUserProfile(managementAccessToken, userId);
      console.log(userProfile);
      const googleCalendarAccessToken = extractIdPAccessToken(
        userProfile,
        "google-oauth2"
      );
      if (googleCalendarAccessToken) {
        res.status(200).json({ googleCalendarAccessToken });
      } else {
        res
          .status(404)
          .json({ message: "Google Calendar is not linked for this user." });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  return {
    getIdentity
    // Export other calendar-related functions here
  };
};
