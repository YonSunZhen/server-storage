import { store_rs_dao, StoreRsDB, image_dao, folder_dao, StoreRsDetailTree, StoreRsDetail } from '../../dao';
import { ResponseUtils } from '@service-fw';
import { Tree, Fs } from 'src/storage/common';
const tree = new Tree('100', 'rsNo', 'rsParentNo');
const fs = new Fs();

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

export async function test(ctx) {
  fs.deleteFolderRecursive('/1_142_图片2/');
  ctx.body = ResponseUtils.normal<any>({ data: '删除成功' });
}

export async function delRs(ctx) {
  // query 不能传数组???
  const _query = ctx.request.query;
  const _noStr: string = _query.rsNo;
  const _noArr = _noStr.split(',');
  for(let i = 0; i < _noArr.length; i++) {
    const _rsNo = _noArr[i];
    const _rsRes = (await store_rs_dao.getStoreRs({rsNo: _rsNo}))[0];
    const _rsPath = _rsRes.rsPath;
    // 删除实体文件
    fs.deleteFolderRecursive(_rsPath);
    // 删除数据库关系数据(rs表 folder表 image表)
    const _tree = new Tree(_rsNo, 'rsNo', 'rsParentNo');
    // 包含状态0&1的数据
    const _storeRsData = await store_rs_dao.getStoreRsDetail();
    const storeRsTreeData = _tree.generateTree<StoreRsDetailTree>(_storeRsData);
    const _recurse = async (data: StoreRsDetailTree) => {
      await _delFolderAndFile(data.data);
      if(data.children) {
        for(let i = 0; i < data.children.length; i++) {
          const d = data.children[i];
          _recurse(d);
        }
      }
    };
    _recurse(storeRsTreeData);
  }
  ctx.body = ResponseUtils.normal<any>({ data: '删除成功' });
}

async function _delFolderAndFile(data: StoreRsDetail) {
  const _rsId = data.rsId;
  const _entityType = data.entityType;
  const _entityId = data.entityId;
  const _delRsRes = await store_rs_dao.delete1({rsId: _rsId});
  let _delEntityRes;
  if(_entityType === 1) {
    _delEntityRes = await folder_dao.delete1({folderId: _entityId});
  } else if(_entityType === 2) {
    _delEntityRes = await image_dao.delete1({imgId: _entityId});
  }
  console.log('这里是调试1');
  console.log(_delRsRes);
  console.log(_delEntityRes);
  
  
}