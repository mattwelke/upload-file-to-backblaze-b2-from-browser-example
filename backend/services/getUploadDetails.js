const axios = require('axios');

module.exports = async ({
    apiUrl,
    authToken,
    bucketId,
}) => {
    const getUploadRes = await axios({
        method: 'POST',
        url: `${apiUrl}/b2api/v2/b2_get_upload_url`,
        headers: {
            'Authorization': authToken,
        },
        data: {
            bucketId,
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
