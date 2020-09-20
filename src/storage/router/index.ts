import Router from 'koa-router';

import test_router from './test/test-router';

const router = new Router();

router.use(test_router.routes(), test_router.allowedMethods());

router.get('/', async (ctx) => {
    ctx.body = 'Welcome to storage!';
});

export { router };