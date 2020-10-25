import { store_rs_dao, StoreRsDB, DaoType } from '../../dao';
import { ResponseUtils } from '@service-fw';
import { Tree } from 'src/storage/common';
const tree = new Tree('100', 'rsNo', 'rsParentNo');

export async function getRsTree(ctx) {
  const _query = ctx.request.query;
  const _storeRsData = await store_rs_dao.getStoreRsDetail({rsStatus: 1});
  const storeRsTreeData = tree.generateTree(_storeRsData);
  ctx.body = ResponseUtils.normal<any>({ data: storeRsTreeData });
}

export async function updateRs(ctx) {
  const _params = ctx.params;
  const _body: StoreRsDB = ctx.request.body;
  const _no = _params.no;
  const _updateData: StoreRsDB = {
    rsStatus: _body.rsStatus
  };
  const _updateRes = await store_rs_dao.update(_no, _updateData);
  if(_updateRes > 0) {
    ctx.body = ResponseUtils.normal<any>({ data: '更新成功' });
  } else {
    ctx.body = ResponseUtils.error<any>({ error_no: 100101});
  }
  
}

export async function getRs(ctx) {
  const _query: StoreRsDB = ctx.request.query;
  const _storeRsData = await store_rs_dao.getStoreRsDetail(_query);
  ctx.body = ResponseUtils.normal<any>({ data: _storeRsData });
}

export async function delRs(ctx) {
  const _params = ctx.params;
  const _body: StoreRsDB = ctx.request.body;
  const _no = _params.no;
  // 删除实体文件

  // 删除数据库关系数据(rs表 folder表 image表)
}