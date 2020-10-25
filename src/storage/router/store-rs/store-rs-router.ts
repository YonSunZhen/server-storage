import Router from 'koa-router';
import * as store_rs_controller from './store-rs-controller';

const router = new Router();
router.prefix('/');

/**
 * @api {POST} /store_rs 获取所有文件关系(树结构)
 * @apiDescription 获取所有文件关系(树结构)
 * @apiVersion 1.0.0
 * @apiName store_rs
 * @apiGroup store_rs
 *
 * @apiParam (body) {string} id id
 * @apiParam (body) {string} [name] name
 */
router.get('/store_rs/tree', store_rs_controller.getRsTree);

/**
 * @api {PUT} /store_rs 修改store_rs
 * @apiDescription 修改store_rs
 * @apiVersion 1.0.0
 * @apiName store_rs
 * @apiGroup store_rs
 *
 * @apiParam (body) {string} id id
 * @apiParam (body) {string} [name] name
 */
router.put('/store_rs/:no', store_rs_controller.updateRs);

/**
 * @api {GET} /store_rs 获取文件关系
 * @apiDescription  获取文件关系
 * @apiVersion 1.0.0
 * @apiName store_rs
 * @apiGroup store_rs
 *
 * @apiParam (body) {string} id id
 * @apiParam (body) {string} [name] name
 */
router.get('/store_rs', store_rs_controller.getRs);

/**
 * @api {DELETE} /store_rs 删除文件关系
 * @apiDescription  删除文件关系
 * @apiVersion 1.0.0
 * @apiName store_rs
 * @apiGroup store_rs
 *
 * @apiParam (body) {string} id id
 * @apiParam (body) {string} [name] name
 */
router.delete('/store_rs/:no', store_rs_controller.delRs);

export default router;