const axios = require("axios");

module.exports = (db) => {

  async function getManagementAPIToken() {
    try {
      const response = await axios.post(
        "https://dev-gk1mwq7vzst50zhs.eu.auth0.com/oauth/token",
        {
          grant_type: "client_credentials",
          client_id: "gVX1gXmlu361MiVk4q5EDBUbjZabBkS3",
          client_secret: "yOgopi2u3sgL9yxQcqJein1Z6W7ixkmqTcPR7dBW1qvY6WZ0ahAvAxwfhvazKGwb",
          audience: "https://dev-gk1mwq7vzst50zhs.eu.auth0.com/api/v2/",
          scope: "read:users read:user_idp_tokens",
        }
      );
      console.log("STEP 1:", response.data);
      return response.data.access_token;
    } catch (error) {
      console.error("Failed to get Management API token:", error);
      throw error;
    }
  }

  async function getAllUsers() {
    const accessToken = await getManagementAPIToken();
    const apiUrl = `https://dev-gk1mwq7vzst50zhs.eu.auth0.com/api/v2/users/`;
   console.log("Start getUsers")
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
        // },
        // params: {
        //   include_totals: true, // Include total count of users in the response
        // },
      });

      const users = response.data;
      return users;
    } catch (error) {
      console.error("Failed to retrieve users:", error);
      return [];
    }
  }
  return {
    getAllUsers,
    // Export other calendar-related functions here
  };
};
