/**
 * ----------------------------------------------------------------------------------------------------
 * Create a Pre-Receive Hook [Run]
 *
 * @description - Create a pre-receive hook using the Github API
 *
 * @author    Buildable Technologies Inc.
 * @access    open
 * @license   MIT
 * @docs      https://docs.github.com/enterprise-server@3.3/rest/reference/enterprise-admin#create-a-pre-receive-hook
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
  const {
    GITHUB_API_TOKEN,
    GITHUB_API_USERNAME,
    name,
    script,
    script_repository,
    environment,
    enforcement,
    allow_downstream_configuration,
  } = input;

  verifyInput(input);

  try {
    const { data } = await axios({
      method: "post",
      url: "https://api.github.com/admin/pre-receive-hooks",
      auth: { password: GITHUB_API_TOKEN, username: GITHUB_API_USERNAME },
      data: {
        name,
        script,
        script_repository,
        environment,
        ...(enforcement ? { enforcement } : {}),
        ...(allow_downstream_configuration
          ? { allow_downstream_configuration }
          : {}),
      },
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
  name,
  script,
  script_repository,
  environment,
}) => {
  const ERRORS = {
    INVALID_GITHUB_API_TOKEN:
      "A valid GITHUB_API_TOKEN field (string) was not provided in the input.",
    INVALID_GITHUB_API_USERNAME:
      "A valid GITHUB_API_USERNAME field (string) was not provided in the input.",
    INVALID_NAME: "A valid name field (string) was not provided in the input.",
    INVALID_SCRIPT:
      "A valid script field (string) was not provided in the input.",
    INVALID_SCRIPT_REPOSITORY:
      "A valid script_repository field (object) was not provided in the input.",
    INVALID_ENVIRONMENT:
      "A valid environment field (object) was not provided in the input.",
  };

  if (typeof GITHUB_API_TOKEN !== "string")
    throw new Error(ERRORS.INVALID_GITHUB_API_TOKEN);
  if (typeof GITHUB_API_USERNAME !== "string")
    throw new Error(ERRORS.INVALID_GITHUB_API_USERNAME);
  if (typeof name !== "string") throw new Error(ERRORS.INVALID_NAME);
  if (typeof script !== "string") throw new Error(ERRORS.INVALID_SCRIPT);
  if (typeof script_repository !== "object")
    throw new Error(ERRORS.INVALID_SCRIPT_REPOSITORY);
  if (typeof environment !== "object")
    throw new Error(ERRORS.INVALID_ENVIRONMENT);
};
