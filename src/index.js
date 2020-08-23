import * as CryptoJS from 'crypto-js';

const getUploadDetailsUrl = 'http://localhost:3000/getUploadDetails';

const getUploadDetails = async () => {
    return new Promise((resolve, reject) => {
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                console.info(`Get upload details response: `, this.responseText);
                const uploadDetails = JSON.parse(this.responseText);
                resolve(uploadDetails);
            }
        });

        xhr.open("GET", getUploadDetailsUrl);

        xhr.send(data);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const uploadFileInput = document.getElementById("uploadFileInput");
    const uploadFileButton = document.getElementById("uploadFileButton");

    // When upload button clicked, get upload details and then perform file
    // upload with AJAX.
    uploadFileButton.addEventListener("click", async () => {
        const uploadDetails = await getUploadDetails();

        const file = uploadFileInput.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            const hash = CryptoJS.SHA1(CryptoJS.enc.Latin1.parse(reader.result));
            // Data hashed. Now perform upload.
            const xhr = new XMLHttpRequest();

            xhr.addEventListener("load", function () {
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
