const getAuthDetails = require('../services/getAuthDetails');
const getUploadDetails = require('../services/getUploadDetails');

module.exports = async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');

    try {
        const authDetails = await getAuthDetails();
        const uploadDetails = await getUploadDetails(authDetails);

        res.json(uploadDetails);
        console.info(`Rendered JSON response with upload details:`, uploadDetails);
        return;
    } catch (e) {
        console.error(`Error while getting B2 upload details:`, e);
        res.status(500).send({
            error: `Could not get upload details: ${e.message}`,
        });
        return;
    }
};
