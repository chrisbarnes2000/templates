/**
 * ----------------------------------------------------------------------------------------------------
 * Update the Username for a User [Run]
 *
 * @description - Update the username for a user using the Github API
 *
 * @author    Buildable Technologies Inc.
 * @access    open
 * @license   MIT
 * @docs      https://docs.github.com/enterprise-server@3.3/rest/reference/enterprise-admin#update-the-username-for-a-user
 *
 * ----------------------------------------------------------------------------------------------------
 */

const axios = require("axios");

/**
 * The Node’s executable function
 *
 * @param {Run} input - Data passed to your Node from the input function
 */
const run = async (input) => {
  const { GITHUB_API_TOKEN, GITHUB_API_USERNAME, username, login } = input;

  verifyInput(input);

  try {
    const { data } = await axios({
      method: "patch",
      url: `https://api.github.com/admin/users/${username}`,
      auth: { password: GITHUB_API_TOKEN, username: GITHUB_API_USERNAME },
      data: { login },
    });

    return data;
  } catch (error) {
    return {
      failed: true,
      message: error.message,
      data: error.response.data,
    };
  }
};

/**
 * Verifies the input parameters
 */
const verifyInput = ({
  GITHUB_API_TOKEN,
  GITHUB_API_USERNAME,
  username,
  login,
}) => {
  const ERRORS = {
    INVALID_GITHUB_API_TOKEN:
      "A valid GITHUB_API_TOKEN field (string) was not provided in the input.",
    INVALID_GITHUB_API_USERNAME:
      "A valid GITHUB_API_USERNAME field (string) was not provided in the input.",
    INVALID_USERNAME:
      "A valid username field (string) was not provided in the input.",
    INVALID_LOGIN:
      "A valid login field (string) was not provided in the input.",
  };

  if (typeof GITHUB_API_TOKEN !== "string")
    throw new Error(ERRORS.INVALID_GITHUB_API_TOKEN);
  if (typeof GITHUB_API_USERNAME !== "string")
    throw new Error(ERRORS.INVALID_GITHUB_API_USERNAME);
  if (typeof username !== "string") throw new Error(ERRORS.INVALID_USERNAME);
  if (typeof login !== "string") throw new Error(ERRORS.INVALID_LOGIN);
};
