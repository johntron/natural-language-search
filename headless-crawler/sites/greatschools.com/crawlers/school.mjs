import {Dataset, KeyValueStore} from "@crawlee/playwright";
import {htmlToText} from "@crawlee/utils";
import {shortTitle} from "../../../pages/base.mjs";

const accessors = {
    html: async (page) => page.$eval('body .school-profile', el => el.outerHTML),
    title: async (page) => await shortTitle(page),
    breadcrumbs: async (page) =>
        await page.$$eval('.community-breadcrumbs', els =>
            Array.from(els).map(el => Array.from(el.querySelectorAll('a')).map(el => el.textContent.trim()).filter(el => el.length))),
    rating: async (page) => await page.$eval('.rs-gs-rating', el => el.textContent),
}

class ItemCrawler {
    key;
    context;

    constructor(key, context) {
        this.key = key
        this.context = context
    }

    async loaded() {
        await this.context.page.waitForSelector('body .main-content')
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
        const content = await page.$eval('body .school-profile', el => el.innerHTML)
        const text = htmlToText(content)
        await KeyValueStore.setValue(this.key, text, {contentType: 'text/plain'});
    }

    async structured() {
        const {page, request} = this.context;
        const {
            title, breadcrumbs, rating, html
        } = accessors
        const data = {
            title: await title(page),
            url: request.loadedUrl,
            breadcrumbs: await breadcrumbs(page),
            rating: await rating(page),
            html: await html(page),
        }
        await Dataset.pushData(data);
    }
}

export {ItemCrawler};