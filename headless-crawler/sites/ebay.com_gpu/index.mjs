import {ItemCrawler} from './crawlers/item.mjs'
import {ListCrawler} from "./crawlers/search-results.mjs";
import {urls} from "./urls.mjs";

export default {
    titleReplacer: (title) => title.replace(/ \| eBay/, ''),
    urls,
    ItemCrawler,
    ListCrawler,
}
