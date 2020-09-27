import Router from 'koa-router';

import test_router from './test/test-router';
import folder_router from './folder/folder-router';

const router = new Router();

router.use(test_router.routes(), test_router.allowedMethods());
router.use(folder_router.routes(), folder_router.allowedMethods());

router.get('/', async (ctx) => {
    ctx.body = 'Welcome to storage!';
});

export { router };