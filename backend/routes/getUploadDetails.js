const getAuthDetails = require('../services/getAuthDetails');
const getUploadDetails = require('../services/getUploadDetails');

module.exports = async (req, res, next) => {
    try {
        const authDetails = await getAuthDetails();
        const uploadDetails = await getUploadDetails(authDetails);

        res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
        res.json(uploadDetails);
        return;
    } catch (e) {
        console.error(`Error while getting B2 upload details:`, e.message);
        res.status(500).send();
        return;
    }
};
