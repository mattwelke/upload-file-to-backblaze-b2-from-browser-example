# browser-b2-upload-file-example

This example demonstrates calling the **b2_upload_file** Backblaze B2 Cloud Storage API from a web browser using XHR AJAX.

The example has two components:

1. An Express back end (in `backend`) to call the b2_get_upload_url without exposing B2 credentials to the browser.
2. A front end JS app (in the root directory) to call the back end with XHR and then use the temporary upload credentials to upload a selected file from the browser. Uses webpack to bundle in crypto-js to perform SHA1 hashing. Builds into a JavaScript bundle in `public`.

# Preparing Backblaze B2 bucket

Create a bucket and use the B2 CLI to apply custom CORS rules. The contents of the `b2CorsRules.json` file in this repo can be used as an example. The policy allows downloads and uploads from any origin. Note that the argument `--corsRules` must be the contents of the CORS policy, not a path to a JSON file on disk with the CORS policy:

```bash
b2 update-bucket --corsRules '[
    {
        "corsRuleName": "downloadFromAnyOriginWithUpload",
        "allowedOrigins": [
            "*"
        ],
        "allowedHeaders": [
            "authorization",
            "content-type",
            "x-bz-file-name",
            "x-bz-content-sha1"
        ],
        "allowedOperations": [
            "b2_download_file_by_id",
            "b2_download_file_by_name",
            "b2_upload_file",
            "b2_upload_part"
        ],
        "maxAgeSeconds": 3600
    }
]' yourBucketName allPublic
```

You'll know you've successfully applied your CORS policy if the B2 web UI shows the option "There are 'custom' rules in place" selected:

![custom CORS rules for bucket screenshot](https://user-images.githubusercontent.com/7719209/90899374-cdc39280-e395-11ea-8fd3-0e62e5893a2d.png)

## Running back end

Run `npm install` from the repo's `backend` directory.

Set the following environment variables:

* B2_KEY_ID - The keyId for your B2 application key
* B2_APPLICATION_KEY - Your B2 application key

Run the app with `node bin/www` from the `backend` directory.

## Running front end

Run `npm install` from the repo's root directory.

Run `npm start` to compile and host the front end app on `http://localhost:3001`. It will launch in your default browser.

Choose file and upload:

![loaded screenshot](https://i.imgur.com/hjbqAvW.png)
