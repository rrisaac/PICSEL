/*
Description: Dynamic routing of SSEs 

@author Rheana Mindo
@date 05/01/2024
*/

import { get } from 'lodash';

// Get base URL depending on the environment
export const getBaseUrl = () => {
    const NODE_ENV = process.env.REACT_APP_NODE_ENV || "development";

    if (NODE_ENV === "development") {
        return "http://localhost:3000"; // URL for local development
    } else if (NODE_ENV === "staging") {
        // Ensure your staging URL is set in the environment variables
        const stagingUrl = get(process.env, "REACT_APP_SERVER_URL");
        if (stagingUrl) {
            return stagingUrl; // URL for staging environment
        } else {
            throw new Error("Missing STAGING_URL. Please check your environment settings.");
        }
    } else {
        throw new Error("Unsupported environment. Only 'development' or 'staging' are valid.");
    }
};
