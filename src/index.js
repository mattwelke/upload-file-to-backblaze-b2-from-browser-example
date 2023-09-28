import * as CryptoJS from 'crypto-js';

const getUploadDetails = async () => {
    return new Promise((resolve, _) => {
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

        xhr.open('GET', 'http://localhost:3000/getUploadDetails');

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
                // Code to execute once the B2 API request finishes. It could have failed. It could
                // have succeeded. We'll find out using the checks in the code here.

                /**
                 * @type {string}
                 */
                let msg;

                if (xhr.status >= 200 && xhr.status < 300) {
                    // Display the success element
                    const ref = document.getElementById('result-message-container');
                    ref.setAttribute('class', 'show');
                    msg = '2xx response from B2 API. Success.';
                } else if (xhr.status >= 400 && xhr.status < 500) {
                    msg = '4xx error from B2 API. See other console log messages and requests in network tab for details.';
                } else if (xhr.status >= 500) {
                    msg = '5xx error from B2 API. See other console log messages and requests in network tab for details.';
                } else {
                    msg = 'Unknown error. See other console log messages and requests in network tab for details.';
                }

                // Whether it succeeded or failed, log a message for the example runner.
                console.log(`Upload file result: ${msg}`);

                console.log('Made result message container element in the DOM visible. If this is being run by the example reader, they should now see it in their browser. If this is being run by the automated test, the test should now be able to progress past its Headless Chrome "wait for selector" step and move on to its assertion step.');
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
