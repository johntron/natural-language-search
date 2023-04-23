import {ItemCrawler} from './crawlers/product.mjs'
import {ListCrawler} from "./crawlers/category.mjs";
import {urls} from "./urls.mjs";

export default {
    titleReplacer: (title) => title.replace(/( for Sale)? \| OPT Telescopes/, ''),
    urls,
    ItemCrawler,
    ListCrawler,
}
