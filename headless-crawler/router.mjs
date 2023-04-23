import {createPlaywrightRouter} from '@crawlee/playwright';
import {handler as itemHandler} from "./pages/item.mjs";
import {handler as listHandler} from "./pages/list.mjs";

const router = createPlaywrightRouter();

router.addDefaultHandler(listHandler)
router.addHandler('list', listHandler)
router.addHandler('item', itemHandler)

export {router}