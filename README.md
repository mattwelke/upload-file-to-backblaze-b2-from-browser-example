# browser-b2-upload-file-example

This example demonstrates calling the **b2_upload_file** Backblaze B2 Cloud Storage API from a web browser using XHR AJAX.

The example has two components:

1. An Express back end (in `backend`) to call the b2_get_upload_url without exposing B2 credentials to the browser.
2. A front end JS app (in the root directory) to call the back end with XHR and then use the temporary upload credentials to upload a selected file from the browser. Uses webpack to bundle in crypto-js to perform SHA1 hashing. Builds into a JavaScript bundle in `public`.

## Running back end

Run `npm install` from the `backend` directory.

Set the following environment variables:

* B2_KEY_ID - The keyId for your B2 application key
* B2_APPLICATION_KEY - Your B2 application key

Run the app with `node bin/www` from the `backend` directory.

## Running front end

Run `npm install`.

Run `npm run build` from the root directory to compile and bundle the front end app.

Run `npm run browser-sync` to host the compiled front end app on `http://localhost:3001`. Note that the CORS settings for the back end app only allow this origin.

Choose file and upload.
