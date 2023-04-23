import {Configuration, PlaywrightCrawler} from '@crawlee/playwright';
import {router} from "./router.mjs";
// import site from './sites/optcorp/index.mjs';
// import site from './sites/greatschools.com/index.mjs'
import site from './sites/ebay.com_gpu/index.mjs'

globalThis.site = site

const {urls} = globalThis.site;
const now = new Date()
const config = new Configuration({
    purgeOnStart: false,
    defaultDatasetId: now,
    defaultKeyValueStoreId: now,
    defaultRequestQueueId: now,
})


await new PlaywrightCrawler({
    // headless: false,
    maxRequestsPerMinute: 10,
    requestHandler: router,
}, config).run([
    // listUrl('telescope-cameras'),
    // urls.list('telescope-mounts'),
    // {label: 'item', url: urls.item('telescope-mounts', 'sky-watcher-az-gti-computerized-altitude-azimuth-mount')},
    // {label: 'item', url: urls.item('texas/dallas/3295-Hyer-Elementary-School')},
    urls.list('rtx 3060 ti')
]);
