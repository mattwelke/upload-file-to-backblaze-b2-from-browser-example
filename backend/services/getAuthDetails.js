const axios = require('axios');

const config = require('../config');

const apiMethodName = 'b2_authorize_account';

module.exports = async () => {
    const authRes = await axios({
        method: 'GET',
        url: `https://api.backblazeb2.com/b2api/v2/${apiMethodName}`,
        auth: {
            username: config.b2KeyId,
            password: config.b2ApplicationKey,
        },
    });

    console.info(`Success getting B2 auth details`);

    const data = authRes.data;
    
    if (!data.allowed) {
        throw new Error(`Missing property "allowed" in ${apiMethodName} response.`);
    }
    if (!data.allowed.bucketId) {
        throw new Error(`Missing property "allowed.bucketId" in ${apiMethodName} response.`);
    }
    if (!data.apiUrl) {
        throw new Error(`Missing property "apiUrl" in ${apiMethodName} response.`);
    }
    if (!data.authorizationToken) {
        throw new Error(`Missing property "authorizationToken" in ${apiMethodName} response.`);
    }

    return {
        bucketId: data.allowed.bucketId,
        apiUrl: data.apiUrl,
        authToken: data.authorizationToken,
    };
};
