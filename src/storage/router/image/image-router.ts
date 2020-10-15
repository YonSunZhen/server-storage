import Router from 'koa-router';
import * as img_controller from './image-controller';

const router = new Router();
router.prefix('/');

/**
 * @api {POST} /images 上传图片
 * @apiDescription 添加文件夹
 * @apiVersion 1.0.0
 * @apiName images
 * @apiGroup images
 *
 * @apiParam (body) {string} id id
 * @apiParam (body) {string} [name] name
 */
router.post('/images', img_controller.insert);

export default router;