const axios = require('axios');

const config = require('../config');

module.exports = async ({
    apiUrl,
    authToken,
}) => {
    const getUploadRes = await axios({
        method: 'POST',
        url: `${apiUrl}/b2api/v2/b2_get_upload_url`,
        headers: {
            'Authorization': authToken,
        },
        data: {
            bucketId: config.b2BucketId,
        },
    });

    console.info(`Success getting B2 upload details`);

    const data = getUploadRes.data;
    const uploadUrl = data.uploadUrl;

    return {
        authToken: data.authorizationToken, // upload auth token, not account auth token
        uploadUrl,
    };
};
