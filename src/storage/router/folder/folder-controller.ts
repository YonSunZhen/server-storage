import { folder_dao, FolderDB, store_rs_dao, DaoType } from '../../dao';
import { ResponseUtils } from '@service-fw';
import { Tree, Fs } from 'src/storage/common';
import { genRsPathName } from '../utils';
const tree = new Tree('100', 'rsNo', 'rsParentNo');
const fs = new Fs();

export async function insert(ctx) {
  const _body: FolderDB = ctx.request.body;
  const rsParentNo = _body['rsParentNo'];
  const _addFolderParams: FolderDB = {
    folderName: _body.folderName,
    folderType: _body.folderType ? _body.folderType : 1,
    folderCreateAt: new Date(),
    folderUpdateAt: new Date()
  };
  // 添加文件夹
  const addFolderRes = await folder_dao.insert(_addFolderParams);
  const _entityId = addFolderRes[0];
  // 添加文件夹关系
  const getStoreRsRes = await store_rs_dao.getStoreRs({rsParentNo, rsStatus: 1});
  const parentInfo = (await store_rs_dao.getStoreRs({rsNo: rsParentNo, rsStatus: 1}))[0];
  const rsNo = tree.generateMaxNo(rsParentNo, getStoreRsRes);
  const _rsPathName = genRsPathName(parentInfo.rsPathName, {
    entityType: 1, 
    entityId: _entityId, 
    name: _body.folderName
  });
  // 创建文件夹
  try {
    await fs.mkdirSync(`./assets${_rsPathName}`);
    const addStoreRsRes = await store_rs_dao.insert({
      entityType: 1,
      entityId: _entityId,
      rsNo,
      rsParentNo,
      rsCreateAt: new Date(),
      rsPathName: _rsPathName
    });
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