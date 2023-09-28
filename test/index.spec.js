const exec = require('child_process').exec;
const express = require('express');
const fs = require('fs/promises');
const puppeteer = require('puppeteer');

const bePort = 3000;
const fePort = 3001;

const _10_SEC = 10000;
const _11_SEC = 11000;

describe('tests', function () {
    this.timeout(2000);

    let feServer;
    /**
     * @type {puppeteer.Browser}
     */
    let beServer;
    /**
     * @type {puppeteer.Browser}
     */
    let browser;

    beforeEach(async function () {
        this.timeout(_10_SEC);

        // Build front end
        exec('npm run build');

        // Start a simulated front end using Express that serves the web page and the front end app
        // JS file.
        const feApp = express();
        feApp.get('/', async (_, res) => {
            res.header('Content-Type', 'text/html');
            res.send((await fs.readFile('index.html')).toString());
        });
        feApp.get('/dist/main.js', async (_, res) => {
            res.header('Content-Type', 'text/javascript');
            res.send((await fs.readFile('dist/main.js')).toString());
        });
        await new Promise(resolve => {
            feServer = feApp.listen(fePort, () => {
                console.log(`Front end web server listening on port ${fePort}.`);
                resolve();
            });
        });

        // Start the back end app.
        // Do this the same way the main application logic does it. This test is like a simplified
        // version of the "www/bin" file in the main application.
        const beApp = require('../backend/app');
        await new Promise(resolve => {
            beServer = beApp.listen(bePort, () => {
                console.log(`Back end web server listening on port ${bePort}.`);
                resolve();
            });
        });

        // Start browser and load front end page with it.
        browser = await puppeteer.launch();
    });

    afterEach(async function () {
        this.timeout(_10_SEC);

        // Stop Puppeteer stuff
        await browser.close();
        console.log('Browser closed.');

        // Stop back end
        await new Promise(resolve => beServer.close(() => resolve()));
        console.log('Back end server closed.');

        // Stop front end
        await new Promise(resolve => feServer.close(() => resolve()));
        console.log('Front end server closed.');
    });

    it('actual test', async function () {
        this.timeout(_11_SEC);

        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('request', request => {
            console.log('PAGE REQUEST:', {
                url: request.url(),
            });
        });

        // Navigate to the web page you want to test
        await page.goto('http://localhost:3001/');

        // Select the file input element and upload a file
        const fileInput = await page.$('#uploadFileInput');
        await fileInput.uploadFile('test/1x1.png'); // TODO

        // Click the upload button
        const uploadButton = await page.$('#uploadFileButton');
        uploadButton.click();

        try {
            // Wait for the file to be uploaded. We assume the file was uploaded if we see the
            // success message ont he DOM.
            await page.waitForSelector('#result-message-container.show', { timeout: _10_SEC });
        } catch (e) {
            console.error('Failed to find success message container element with desired class name in alloted time', e);
        }

        await page.close();
    });
});
