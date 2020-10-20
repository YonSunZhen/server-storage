import Router from 'koa-router';
import * as store_rs_controller from './store-rs-controller';

const router = new Router();
router.prefix('/');

/**
 * @api {POST} /store_rs 获取所有文件关系
 * @apiDescription 获取所有文件关系
 * @apiVersion 1.0.0
 * @apiName store_rs
 * @apiGroup store_rs
 *
 * @apiParam (body) {string} id id
 * @apiParam (body) {string} [name] name
 */
router.get('/store_rs/tree', store_rs_controller.getTree);

export default router;