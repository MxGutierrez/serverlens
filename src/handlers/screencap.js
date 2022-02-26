const puppeteer = require('puppeteer-core');
// async function run() {
// let browser = await puppeteer.launch({ headless: false });
// let page = await browser.newPage();
// await page.goto('https://www.scrapehero.com/');
// await page.screenshot({ path: './image.jpg', type: 'jpeg' });
// await page.close();
// await browser.close();
// }
exports.handler = async (event) => {
    console.log('event', event);
    console.log('puppeteer', puppeteer);

    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: "Works"
    };
}