import * as _ from 'lodash';
import * as CryptoJS from 'crypto-js';

import { getUploadDetails } from './getUploadDetails';

export interface UploadDetails {
    uploadUrl: string;
    authToken: string;
};

document.addEventListener("DOMContentLoaded", () => {
    const uploadFileInput = document.getElementById("uploadFileInput") as HTMLInputElement;
    const uploadFileButton = document.getElementById("uploadFileButton") as HTMLButtonElement;

    // When upload button clicked, get upload details and then perform file
    // upload with AJAX.
    uploadFileButton.addEventListener("click", async () => {
        const uploadDetails = await getUploadDetails();

        const file = uploadFileInput.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            const hash: string = (CryptoJS.SHA1(CryptoJS.enc.Latin1.parse(reader.result as string))) as any;
            // Data hashed. Now perform upload.
            const xhr = new XMLHttpRequest();

            xhr.addEventListener("load", function (this) {
                console.info(`XHR response:`, this.response);
            });

            xhr.open("POST", uploadDetails.uploadUrl);

            xhr.setRequestHeader("Content-Type", "image/png");
            xhr.setRequestHeader("Authorization", uploadDetails.authToken);
            xhr.setRequestHeader("X-Bz-File-Name", uploadFileInput.files[0].name);
            xhr.setRequestHeader("X-Bz-Content-Sha1", hash);

            const fileToSend = uploadFileInput.files[0];

            xhr.send(fileToSend);
        };
        reader.readAsBinaryString(file);
    });
});
