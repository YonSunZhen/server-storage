import Router from 'koa-router';

import test_router from './test/test-router';
import folder_router from './folder/folder-router';
import img_router from './image/image-router';
import store_rs_router from './store-rs/store-rs-router';

const router = new Router();

router.use(test_router.routes(), test_router.allowedMethods());
router.use(folder_router.routes(), folder_router.allowedMethods());
router.use(img_router.routes(), img_router.allowedMethods());
router.use(store_rs_router.routes(), store_rs_router.allowedMethods());

router.get('/', async (ctx) => {
    ctx.body = 'Welcome to storage!';
});

export { router };