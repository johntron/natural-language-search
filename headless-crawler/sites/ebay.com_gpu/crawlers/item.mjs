import {Dataset, KeyValueStore, log} from "@crawlee/playwright";
import {htmlToText} from "@crawlee/utils";
import {shortTitle} from "../../../pages/base.mjs";

const seller = (el) => {
    const match = el.textContent.match(/(?<name>.+) \((?<review_count>\d+)\) (?<rating>[\d.]+)% positive feedback/i)
    if (!match) {
        log.error('Could not find seller info')
        return {review_count: null, rating: null};
    }
    const {groups: {review_count, rating}} = match
    return {
        review_count: Number(review_count), rating: Number(rating)
    }
}

const accessors = {
    title: async (page) => await shortTitle(page),
    breadcrumbs: async (page) => await page.$$eval('.breadcrumbs .seo-breadcrumb-text', els => Array.from(els).map(el => el.textContent)),
    price: async (page) => await page.$eval('.x-price-primary', el => el.textContent.match(/[\d.]+/)[0]),
    currency: async (page) => await page.$eval('.x-price-primary [itemprop="priceCurrency"]', el => el.getAttribute('content')),
    seller: async (page) => await page.$eval('.ux-seller-section', seller),
    seller_review_count: async (page) => (await accessors.seller(page)).review_count,
    seller_rating: async (page) => (await accessors.seller(page)).rating,
}

class ItemCrawler {
    key;
    context;

    constructor(key, context) {
        this.key = key
        this.context = context
    }


    async loaded() {
        await this.context.page.waitForSelector('body .x-price-primary')
    }

    async all() {
        return await Promise.all([this.html(), this.text(), this.structured(),])
    }

    async html() {
        const {page} = this.context;
        const content = await page.content();
        await KeyValueStore.open()
        await KeyValueStore.setValue(this.key, content, {contentType: 'text/html'});
    }

    async text() {
        const {page} = this.context;
        const content = await page.$eval('#Body', el => el.innerHTML)
        const text = htmlToText(content)
        await KeyValueStore.setValue(this.key, text, {contentType: 'text/plain'});
    }

    async structured() {
        const {page, request} = this.context;
        const {
            title,
            breadcrumbs,
            price,
            currency,
            seller_review_count,
            seller_rating,
        } = accessors
        const data = {
            title: await title(page),
            url: request.loadedUrl,
            breadcrumbs: await breadcrumbs(page),
            price: await price(page),
            currency: await currency(page),
            seller_review_count: await seller_review_count(page),
            seller_rating: await seller_rating(page),
        }
        await Dataset.pushData(data);
    }
}

export {ItemCrawler};