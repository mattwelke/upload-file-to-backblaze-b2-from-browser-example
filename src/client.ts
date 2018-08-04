import * as _ from "lodash";

type UploadDetails = {
  uploadUrl: string;
  fileUri: string;
  authToken: string;
};

/**
 * Helper function. Describes how objects are JSON-stringified in the application.
 * @param obj The object to be stringifed.
 */
const jsonStringify: (obj: any) => string = (obj: any) => {
  return JSON.stringify(obj, null, 4);
};

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Helper used to check if form input is ready.
   */
  const getUploadDetails: () => UploadDetails | null = () => {
    const uploadUrlValid =
      !_.isNil(uploadUrlInput) && uploadUrlInput.value.length > 0;
    const fileValid =
      !_.isNil(uploadFileInput) && uploadFileInput.value.length > 0;
    const authTokenValid =
      !_.isNil(authTokenInput) && authTokenInput.value.length > 0;

    if (uploadUrlValid && fileValid && authTokenValid) {
      return {
        uploadUrl: uploadUrlInput.value,
        fileUri: uploadFileInput.value,
        authToken: authTokenInput.value
      };
    }

    return null;
  };

  // Set element refs
  const uploadUrlInput = document.getElementById(
    "uploadUrlInput"
  ) as HTMLInputElement;
  const authTokenInput = document.getElementById(
    "authTokenInput"
  ) as HTMLInputElement;
  const uploadFileInput = document.getElementById(
    "uploadFileInput"
  ) as HTMLInputElement;
  const uploadFileButton = document.getElementById(
    "uploadFileButton"
  ) as HTMLButtonElement;

  // When either input changes, check if upload details are ready. If so, enable upload file
  // button. If not, disable it.
  const onInputChange = () => {
    const details = getUploadDetails();

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
  uploadFileButton.addEventListener("click", () => {
    const details = getUploadDetails();

    if (details !== null) {
      console.info("Valid upload details. Beginning upload.");

      const xhr = new XMLHttpRequest();

      xhr.addEventListener("load", function(this) {
        alert(jsonStringify(this.response));
      });

      xhr.open("POST", uploadUrlInput.value);

      xhr.setRequestHeader("Content-Type", "image/png");
      xhr.setRequestHeader("Authorization", authTokenInput.value);
      xhr.setRequestHeader("X-Bz-File-Name", uploadFileInput.files[0].name);
      xhr.setRequestHeader("X-Bz-Content-Sha1", "unknown");

      xhr.send();
    } else {
      const msg = "Invalid upload details. Cancelling upload.";
      console.info(msg);
      alert(msg);
    }
  });

  // FUTURE: Contact back end API to get download URL and then set the image display element src to this URL.
});
