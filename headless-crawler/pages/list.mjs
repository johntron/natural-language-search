import {shortTitle, shortUrl} from "./base.mjs";


const pageNumber = (request) => (new URL(request.loadedUrl).searchParams.get('page') || 1)

const handler = async (context) => {
    const {request, page, log} = context;
    const {ListCrawler} = globalThis.site;
    log.info(`LIST: "${await shortTitle(page)}" p${pageNumber(request)} - ${shortUrl(request.loadedUrl)}`);
    const crawler = new ListCrawler(null, context);
    await crawler.loaded()
    await crawler.all()
};

export {handler}