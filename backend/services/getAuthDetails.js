const axios = require('axios');

const config = require('../config');

module.exports = async () => {
    const authRes = await axios({
        method: 'GET',
        url: 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
        auth: {
            username: config.b2KeyId,
            password: config.b2ApplicationKey,
        },
    });

    console.info(`Success getting B2 auth details`);

    const data = authRes.data;

    const bucketId = data.allowed.bucketId;
    const apiUrl = data.apiUrl;
    const authToken = data.authorizationToken;

    return {
        bucketId,
        apiUrl,
        authToken,
    };
};
