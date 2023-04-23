import {log} from "@crawlee/playwright";

const paginationSelector = '.pagination__items a';
const itemSelector = '.srp-results .s-item .s-item__link';
const transformListRequestFunction = request => {
    debugger
    const url = new URL(request.url)

    if (url.searchParams.get('_pgn') === '1') {
        url.searchParams.delete('_pgn')
    }

    url.searchParams.sort()

    // Fix for leading "?" - e.g. ?&page=1
    url.search = url.searchParams.toString()

    request.url = url.toString()
    log.debug(`normalized URL: ${url}`)
    return request;
}

class ListCrawler {
    constructor(key, context) {
        this.key = key;
        this.context = context;
    }

    async loaded() {
        await this.context.page.waitForSelector(paginationSelector);
    }

    async all() {
        await this.context.enqueueLinks({
            label: 'list',
            strategy: 'same-domain',
            selector: paginationSelector,
            transformRequestFunction: transformListRequestFunction,
        })
        await this.context.enqueueLinks({
            label: 'item',
            strategy: 'same-domain',
            selector: itemSelector,
        });

    }
}

export {ListCrawler};