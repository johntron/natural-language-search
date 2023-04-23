import {shortTitle, shortUrl} from "./base.mjs";
import {key} from "../store.mjs";

const handler = async (context) => {
    const {request, page, log} = context;
    const {ItemCrawler} = globalThis.site
    const title = await shortTitle(page);
    log.info(`ITEM: "${title}" - ${shortUrl(request.loadedUrl)}`);
    const storageKey = key(title)
    log.debug(`storageKey: ${storageKey}`)
    const crawler = new ItemCrawler(storageKey, context);
    await crawler.loaded();
    await crawler.all()
}

export {handler}