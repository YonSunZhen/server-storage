import { store_rs_dao, StoreRsDB, DaoType } from '../../dao';
import { ResponseUtils } from '@service-fw';
import { Tree } from 'src/storage/common/tree';
const tree = new Tree('100', 'rsNo', 'rsParentNo');

export async function getTree(ctx) {
  const _query = ctx.request.query;
  const _storeRsData = await store_rs_dao.getStoreRsDetail({rsStatus: 1});
  const storeRsTreeData = tree.generateTree(_storeRsData);
  ctx.body = ResponseUtils.normal<any>({ data: storeRsTreeData });
}