/**
 * ----------------------------------------------------------------------------------------------------
 * List Check Runs for a Git Reference [Input]
 *
 * @author    Buildable Technologies Inc.
 * @access    open
 * @license   MIT
 * @docs      https://docs.github.com/enterprise-server@3.3/rest/reference/checks#list-check-runs-for-a-git-reference
 * ----------------------------------------------------------------------------------------------------
 */

/**
 * Lets you select the input for your Node's run function
 *
 * @param {Params} params
 * @param {Object} $trigger - This Flow's request object
 * @param {Object} $nodes - Data from above Nodes
 */
const nodeInput = ({ $trigger, $nodes }) => {
  return {
    GITHUB_API_TOKEN: $trigger.env.GITHUB_API_TOKEN, // Required
    GITHUB_API_USERNAME: $trigger.env.GITHUB_API_USERNAME, // Required
    owner: "string", // Required
    repo: "string", // Required
    ref: "string", // Required

    // check_name: "string",
    // status: "queued",
    // filter: "latest",
    // per_page: 30,
    // page: 1,
    // app_id: 0,
  };
};
