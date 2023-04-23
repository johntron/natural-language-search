import {Dataset, KeyValueStore} from "@crawlee/playwright";
import {htmlToText} from "@crawlee/utils";
import {shortTitle} from "../../../pages/base.mjs";

const accessors = {
    html: async (page) => page.$eval('body .product', el => el.outerHTML),
    title: async (page) => await shortTitle(page),
    breadcrumbs: async (page) =>
        await page.$$eval('.breadcrumb-collection .breadcrumb_text', els =>
            Array.from(els).map(el => Array.from(el.querySelectorAll('a')).map(el => el.textContent.trim()).filter(el => el.length))),
    vendor: async (page) => await page.$eval('.vendor .vendor', el => el.textContent),
    price: async (page) => cleanPrice(await page.$eval('.current_price', s => s.textContent)),
    specs: async (page) => {
        const entries = await page.$$eval('.specifications tr', trs => trs.map(tr => [tr.querySelector('.left').textContent.trim(), tr.querySelector('.right').textContent.trim(),]));
        return Object.fromEntries(entries)
    }
}

function cleanPrice(price) {
    return price.match(/[\d.,]+/)[0].replace(",", '');
}

class ItemCrawler {
    key;
    context;

    constructor(key, context) {
        this.key = key
        this.context = context
    }

    async loaded() {
        await this.context.page.waitForSelector('body .product')
    }

    async all() {
        return await Promise.all([
            this.html(),
            this.text(),
            this.structured(),
        ])
    }

    async html() {
        const {page} = this.context;
        const content = await page.content();
        await KeyValueStore.open()
        await KeyValueStore.setValue(this.key, content, {contentType: 'text/html'});
    }

    async text() {
        const {page} = this.context;
        const content = await page.$eval('body .product', el => el.innerHTML)
        const text = htmlToText(content)
        await KeyValueStore.setValue(this.key, text, {contentType: 'text/plain'});
    }

    async structured() {
        const {page, request} = this.context;
        const {
            title, breadcrumbs, vendor, price, specs, html
        } = accessors
        const data = {
            title: await title(page),
            url: request.loadedUrl,
            breadcrumbs: await breadcrumbs(page),
            vendor: await vendor(page),
            price: await price(page),
            specs: await specs(page),
            html: await html(page),
        }
        await Dataset.pushData(data);
    }
}

export {ItemCrawler};