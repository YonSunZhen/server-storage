import { store_rs_dao, StoreRsDB, image_dao, folder_dao, StoreRsDetailTree, StoreRsDetail, ImageDB } from '../../dao';
import { ResponseUtils } from '@service-fw';
import { Tree, Fs } from 'src/storage/common';
import { genImgName, genRsPathName } from '../utils';
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
    const _rsRes = (await store_rs_dao.getStoreRsDetail({rsNo: _rsNo}))[0];
    const _rsPathName = _rsRes.rsPath;
    // 删除实体文件
    fs.deleteFolderRecursive(_rsPathName);
    // 删除数据库关系数据(rs表 folder表 image表)
    const _tree = new Tree(_rsNo, 'rsNo', 'rsParentNo');
    // 包含状态0&1的数据
    const _storeRsData = await store_rs_dao.getStoreRsDetail();
    const storeRsTreeData = _tree.generateTree<StoreRsDetailTree>(_storeRsData);
    const _recurseFn = async (data: StoreRsDetailTree) => {
      await _delFolderAndFile(data.data);
      if(data.children) {
        for(let i = 0; i < data.children.length; i++) {
          const d = data.children[i];
          _recurseFn(d);
        }
      }
    };
    _recurseFn(storeRsTreeData);
  }
  ctx.body = ResponseUtils.normal<any>({ data: '删除成功' });
}

export async function updateRsDetail(ctx) {
  
  const _params = ctx.params;
  const _body = ctx.request.body;
  const _no = _params.no;
  const _fileName = _body['fileName'];
  const _rsParentNo = _body['rsParentNo'];
  const _rsData = (await store_rs_dao.getStoreRsDetail({rsNo: _no}))[0];
  const _entityType = _rsData.entityType;
  const _entityId = _rsData.entityId;
  const _fileType = _rsData.imgType;
  if(_entityType === 1) {  
    await folder_dao.update(_entityId, {folderName: _fileName, folderUpdateAt: new Date()});
  } else if(_entityType === 2) {
    const _updateImgParams: ImageDB = Object.assign({}, genImgName(_fileName));
    _updateImgParams.imgUpdateAt = new Date();
    await image_dao.update(_entityId, _updateImgParams);
  }
  const _parentInfo = (await store_rs_dao.getStoreRs({rsNo: _rsParentNo, rsStatus: 1}))[0];
  const _rsPathName = genRsPathName(_parentInfo.rsPathName, {
    entityId: _entityId,
    entityType: _entityType,
    name: _fileName,
    fileType: _fileType
  });
  await store_rs_dao.update(_no, {rsPathName: _rsPathName});
  const _newRsPathName = (await store_rs_dao.getStoreRsDetail({rsNo: _no}))[0].rsPath;
  // 修改内存文件名
  fs.rename(_rsData.rsPath, _newRsPathName);
  ctx.body = ResponseUtils.normal<any>({ data: '更新成功' });
  
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
  // console.log(_delRsRes);
  // console.log(_delEntityRes);
  
}