# upload-file-to-backblaze-b2-from-browser-example

This example demonstrates using the "b2_upload_file" Backblaze B2 Cloud Storage API from a web browser to upload a file directly from a web browser to the B2 bucket, without the file contents having to go through an intermediate web server you control.

This is similar to using techniques with other cloud storage providers such as AWS's [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html) and GCP's [signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls).

An intermediate web server is used, but only to authenticate the client, not to transmit the file contents to the B2 bucket. If the example were expanded to a real world use case, your own IAM system would control whether or not the web browser would be allowed to obtain the B2 token and perform the file upload, based on your own logic.

# Components

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
* B2_BUCKET_ID - The ID of the B2 bucket you're uploading files into.

If you're following this tutorial as a new Backblaze B2 user, and you created a bucket just for this test, you can get the bucket ID by looking at your list of buckets after logging in(https://secure.backblaze.com/b2_buckets.htm):

![get_bucket_id](https://user-images.githubusercontent.com/7719209/163889482-f4ee4a48-b9d3-4b7c-a38a-324713d45ea0.png)

Run the app with `npm start` from the `backend` directory.

It can be helpful to step through an example line by line with a debugger instead of running the app this way. If you want to do this with VS Code, you can use a launch config like this:

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/backend/bin/www",
            "env": {
                "B2_KEY_ID": "<your_key_id>",
                "B2_APPLICATION_KEY": "<your_application_key>",
                "B2_BUCKET_ID": "<your_bucket_id>"
            }
        }
    ]
}
```

## Running front end

Run `npm install` from the repo's root directory.

Run `npm start` to compile and host the front end app on `http://localhost:3001`. It will launch in your default browser.

Choose file and upload:

![loaded screenshot](https://i.imgur.com/hjbqAvW.png)
