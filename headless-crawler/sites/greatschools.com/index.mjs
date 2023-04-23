import {ItemCrawler} from './crawlers/school.mjs'
import {ListCrawler} from "./crawlers/school-list.mjs";
import {urls} from "./urls.mjs";

export default {
    titleReplacer: (title) => title.replace(/(, [\d-]+)? | GreatSchools/, ''),
    urls,
    ItemCrawler,
    ListCrawler,
}
