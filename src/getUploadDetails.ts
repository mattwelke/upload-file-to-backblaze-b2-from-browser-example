import * as _ from 'lodash';
import { UploadDetails } from '.';

const getUploadDetailsUrl = 'http://localhost:3000/getUploadDetails';

/**
 * getUploadDetailsAjax fetches the upload details from the running back end.
 */
export const getUploadDetails: () => Promise<UploadDetails> = async () => {
    return new Promise((resolve, reject) => {
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                console.info(`Get upload details response: `, this.responseText);
                const uploadDetails: UploadDetails = JSON.parse(this.responseText);
                resolve(uploadDetails);
            }
        });

        xhr.open("GET", getUploadDetailsUrl);

        xhr.send(data);
    });
};
