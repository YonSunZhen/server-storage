import Router from 'koa-router';
import * as folder_controller from './folder-controller';

const router = new Router();
router.prefix('/');

/**
 * @api {POST} /folders 添加文件夹
 * @apiDescription 添加文件夹
 * @apiVersion 1.0.0
 * @apiName folders
 * @apiGroup folders
 *
 * @apiParam (body) {string} id id
 * @apiParam (body) {string} [name] name
 */
router.post('/folders', folder_controller.insert);

export default router;