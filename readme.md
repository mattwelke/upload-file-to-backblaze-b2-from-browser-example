# browser-b2-upload-file-example

This example demonstrates calling the **b2_upload_file** Backblaze B2 Cloud Storage API from a web browser using XHR AJAX.

The example is built in TypeScript.

## Build

1. Make sure all NPM packages are installed (with `npm i` or `yarn` etc).
1. Run `npm build`.

The file `public/scripts/bundle.js` will be created with the compiled, concatenated client code.

## Run locally

1. Make sure all NPM packages are installed (with `npm i` or `yarn` etc).
1. Run `npm run browser-sync`.

Your default web browser will be opened to `http://localhost:3000` and any changes to any files in `public` will cause the browser tab to be refreshed automatically, including when a build is completed. CSS changes will result in a hot reload, not a full page refresh.
