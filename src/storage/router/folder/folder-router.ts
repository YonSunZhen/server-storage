import Router from 'koa-router';
import * as folder_controller from './folder-controller';

const router = new Router();
router.prefix('/');

/**
 * @api {POST} /folder 添加文件夹
 * @apiDescription 添加文件夹
 * @apiVersion 1.0.0
 * @apiName folder
 * @apiGroup folder
 *
 * @apiParam (body) {string} id id
 * @apiParam (body) {string} [name] name
 */
router.post('/folder', folder_controller.insert);

export default router;