const paginationSelector = '.snize-pagination a';
const itemSelector = '.snize-search-results-main-content a';
const transformListRequestFunction = request => {
    const url = new URL(request.url)

    if (url.searchParams.get('page') === '1') {
        url.searchParams.delete('page')
    }

    url.searchParams.sort()

    // Fix for leading hash - e.g. ?&page=1
    url.search = url.searchParams.toString()

    request.url = url.toString()
    return request;
}

class ListCrawler {
    constructor(key, context) {
        this.key = key;
        this.context = context;
    }

    async loaded() {
        await this.context.page.waitForSelector('.snize-product');
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