import { folder_dao, FolderDB, store_rs_dao, DaoType } from '../../dao';
import { ResponseUtils } from '@service-fw';

export async function insert(ctx) {
  const _body: FolderDB = ctx.request.body;
  const _addFolderParams: FolderDB = {
    folderName: _body.folderName,
    folderType: _body.folderType ? _body.folderType : 1,
    folderCreateAt: new Date(),
    folderUpdateAt: new Date()
  };
  const addFolderRes = await folder_dao.insert(_addFolderParams);
  console.log(addFolderRes);
  
  // const addStoreRsRes = await store_rs_dao.insert()
}