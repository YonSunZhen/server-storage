import { image_dao, ImageDB, store_rs_dao, DaoType } from '../../dao';
import { ResponseUtils } from '@service-fw';
import { Tree, Fs } from 'src/storage/common';
const tree = new Tree('100', 'rsNo', 'rsParentNo');
const fs = new Fs();

export async function insert(ctx) {
  if (!/^multipart\/form-data;\sboundary=.*/.test(ctx.request.headers['content-type'])) {
    (ctx.body = { message: 'the content-type is error,please use "multipart/form-data".' });
    return;
  }
  const _body: ImageDB = ctx.request.body;
  const _rsParentNo = _body['rsParentNo'];
  const _imgType = _body.imgType ? _body.imgType : 'jpg';
  const _files = ctx.request.files;
  const _image = _files['imgData'];
  const _imgPath = _image['path'];
  const _addImageParams: ImageDB = {
    imgType: _imgType,
    imgOriginName: `${_body.imgOriginName}`,
    imgThumName: `${_body.imgOriginName}_thum`,
    imgIntactName: `${_body.imgOriginName}_intact`,
    imgCreateAt: new Date()
  };
  // 添加图片
  const addImageRes = await image_dao.insert(_addImageParams);
  const _entityId = addImageRes[0];
  // 添加图片关系
  const getStoreRsRes = await store_rs_dao.getStoreRs({rsParentNo: _rsParentNo, rsStatus: 1});
  const parentInfo = (await store_rs_dao.getStoreRs({rsNo: _rsParentNo, rsStatus: 1}))[0];
  const rsNo = tree.generateMaxNo(_rsParentNo, getStoreRsRes);
  const _rsPath = `${parentInfo.rsPath}2_${_entityId}_${_body.imgOriginName}.${_imgType}`;
  const addStoreRsRes = await store_rs_dao.insert({
    entityType: 2,
    entityId: _entityId,
    rsNo,
    rsParentNo: _rsParentNo,
    rsCreateAt: new Date(),
    rsPath: _rsPath
  });
  
  // 上传图片
  // 待办： 添加压缩图片功能 https://www.cnblogs.com/fslnet/p/11769436.html
  const _imgData = await fs.readFileSync(_imgPath); //将上传到服务器上的临时资源 读取到一个变量里面
  try {
    await fs.writeFileSync(`./assets${_rsPath}`, _imgData);
    if(addStoreRsRes) {
      const _res = await store_rs_dao.getStoreRsDetail({rsId: addStoreRsRes[0]});
      ctx.body = ResponseUtils.normal<any>({ data: _res });
    } else {
      ctx.body = ResponseUtils.error<any>({ error_no: 100102 });
    }
  } catch (err) {
    ctx.body = ResponseUtils.error<any>({ error_no: 100102 });
    console.log(err);
  }
}