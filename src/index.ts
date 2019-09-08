import * as _ from 'lodash';
import CryptoJS = require("crypto-js");

function arrayBufferToWordArray(ab) {
    var i8a = new Uint8Array(ab);
    var a = [];
    for (var i = 0; i < i8a.length; i += 4) {
      a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
    }
    return CryptoJS.lib.WordArray.create(a);
  }

import { getUploadDetails } from './getUploadDetails';

export interface UploadDetails {
    uploadUrl: string;
    fileUri: string;
    authToken: string;
};

document.addEventListener("DOMContentLoaded", () => {
    const uploadUrlInput = document.getElementById("uploadUrlInput") as HTMLInputElement;
    const authTokenInput = document.getElementById("authTokenInput") as HTMLInputElement;
    const uploadFileInput = document.getElementById("uploadFileInput") as HTMLInputElement;
    const uploadFileButton = document.getElementById("uploadFileButton") as HTMLButtonElement;

    // When either input changes, check if upload details are ready. If so, enable upload file
    // button. If not, disable it.
    const onInputChange = () => {
        const details = getUploadDetails(document);

        if (details !== null) {
            uploadFileButton.disabled = false;
            uploadFileButton.classList.remove("btn-default");
            uploadFileButton.classList.add("btn-primary");
            console.info("Upload details ready. Enabled upload button.");
        } else {
            uploadFileButton.disabled = true;
            uploadFileButton.classList.remove("btn-primary");
            uploadFileButton.classList.add("btn-default");
            console.info("Upload details not ready. Disabled upload button.");
        }
    };

    uploadFileInput.addEventListener("change", onInputChange);
    // 250ms debounced keypress
    [uploadUrlInput, authTokenInput].forEach(el => {
        el.addEventListener("keydown", () => setTimeout(onInputChange, 500));
    });

    // When upload button clicked, get upload details. If valid, proceed with AJAX upload to
    // B2 upload URL.
    uploadFileButton.addEventListener("click", async () => {
        const details = getUploadDetails(document);

        if (details !== null) {
            console.info("Valid upload details. Beginning upload.");

            const file = uploadFileInput.files[0];
            const reader = new FileReader();
            reader.onloadend = function () {
                const hash: string = (CryptoJS.SHA1(CryptoJS.enc.Latin1.parse(reader.result as string))) as any;
                // Data hashed. Now perform upload.
                // console.info(`Hash: ${hash}`);
                const xhr = new XMLHttpRequest();

                xhr.addEventListener("load", function (this) {
                    console.info(`XHR response:`, this.response);
                });

                xhr.open("POST", uploadUrlInput.value);

                xhr.setRequestHeader("Content-Type", "image/png");
                xhr.setRequestHeader("Authorization", authTokenInput.value);
                xhr.setRequestHeader("X-Bz-File-Name", uploadFileInput.files[0].name);
                xhr.setRequestHeader("X-Bz-Content-Sha1", hash);

                const fileToSend = uploadFileInput.files[0];

                xhr.send(fileToSend);
            };
            reader.readAsBinaryString(file);
        } else {
            const msg = "Invalid upload details. Cancelling upload.";
            console.info(msg);
            alert(msg);
        }
    });
});
