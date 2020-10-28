import { storage_db as db } from '../storage-db';
import { storage_logger as logger } from '@storage-logger';
import { StoreRsDB, StoreRsDetail } from './store-rs-types';
import { DaoType } from '../dao-types';
import { DataOptions, dbHelper } from '../utils';
import { folder_dao } from '../folder';
import { image_dao } from '../image';

const TABLE_NAME = 'store_rs';

async function ensure() {
  if (!await db.schema.hasTable(TABLE_NAME)) {
    logger.info(`create table '${TABLE_NAME}' now...`);
    await db.schema.createTable(TABLE_NAME, (t) => {
      t.charset('utf8mb4');
      t.increments('rsId').primary().notNullable().comment('自增id');
      t.integer('entityType', 10).defaultTo(null).comment('实体类型');
      t.integer('entityId', 10).defaultTo(null).comment('实体id');
      t.string('rsPathName', 200).defaultTo(null).comment('路径');
      t.string('rsNo', 200).defaultTo(null).comment('存储编号');
      t.string('rsParentNo', 200).defaultTo(null).comment('父编号');
      t.dateTime('rsCreateAt').defaultTo(null).comment('创建时间');
      t.integer('rsStatus').defaultTo(1).comment('状态 0删除 1存在');
    }).catch((err) => logger.error(err));
    await db.table(TABLE_NAME).insert([
      {
        'entityType': 1,
        'rsPathName': '',
        'rsNo': '100'
      }
    ]);
  }
}

async function insert(options: StoreRsDB): Promise<number> {
  const _options = DataOptions(options);
  const res: number = await db.table(TABLE_NAME).insert(_options);
  return res;
}

async function getStoreRs(options: StoreRsDB): Promise<StoreRsDB[]> {
  const _options = DataOptions(options);
  const res: StoreRsDB[] = await db.table(TABLE_NAME).select('*').where(_options);
  return res;
}

async function getStoreRsDetail(options?: StoreRsDB): Promise<StoreRsDetail[]> {
  const _options = DataOptions(options);
  // const res = await db.table(TABLE_NAME).select('*').leftJoin('folder', function() {
  //   this.on(`${TABLE_NAME}.entityId`, '=', 'folder.folderId').onIn(`${TABLE_NAME}.entityType`, ['1']);
  // }).leftJoin('image', function() {
  //   this.on(`${TABLE_NAME}.entityId`, '=', 'image.imgId').onIn(`${TABLE_NAME}.entityType`, ['2']);
  // }).where(_options);
  const res = [];
  const _folderData = await folder_dao.getFolder();
  const _imgData = await image_dao.getImage();
  const _storeRsData: StoreRsDB[] = await db.table(TABLE_NAME).select('*').where(_options);
  for(let i = 0; i < _storeRsData.length; i++) {
    const _s = _storeRsData[i];
    let _entityObj;
    if(_s.entityType === 1) {
      _entityObj =  await _getEntityData(_s, _folderData);
    } else if(_s.entityType === 2) {
      _entityObj = await _getEntityData(_s, _imgData);
    }
    const _resItem = Object.assign({}, _s, _entityObj);
    res.push(_resItem);
  }
  return res;
}

async function _getEntityData(storeRsItem: StoreRsDB, entityData: any[]) {
  let res: StoreRsDetail = {};
  const _entityId = storeRsItem.entityId;
  entityData.forEach(e => {
    const _id = e['imgId'] || e['folderId'];
    if(_entityId === _id) {
      res = e;
    }
  });
  // 拼接生成rsPath
  const _rsParentNo = storeRsItem.rsParentNo;
  const _rsPathName = storeRsItem.rsPathName;
  if(_rsParentNo) {
    const _rsPath = await genRsPath(_rsPathName, _rsParentNo);
    res.rsPath = _rsPath;
  } 
  return res;
}

export async function genRsPath(rsPathName: string, rsParentNo: string): Promise<string> {
  let res = '';
  const _rsParentNoArr = _genRsParentNoArr(rsParentNo);
  for(let i = 0; i < _rsParentNoArr.length; i++) {
    const _rsNoItem = _rsParentNoArr[i];
    const _rsParnetPathName = (await getStoreRs({rsNo: _rsNoItem}))[0].rsPathName;
    res += _rsParnetPathName;
  }
  res += rsPathName;
  return res;
}

// 100001001 => 100 100001 100001001
function _genRsParentNoArr(rsParentNo: string): string[] {
  const res = [];
  const _parentNoLen = rsParentNo.length / 3;
  for(let i = 0; i < _parentNoLen; i++) {
    const _index = (i + 1)*3;
    const _item = rsParentNo.slice(0, _index);
    res.push(_item);
  }
  return res;
}

async function update(rsNo: string, options: StoreRsDB) {
  const _options = DataOptions(options);
  const res = await db.table(TABLE_NAME).update(_options).where({rsNo});
  return res;
}

async function delete1(options: StoreRsDB) {
  const _options = DataOptions(options);
  const res = await db.table(TABLE_NAME).delete().where(_options);
  return res;
}

export const store_rs_dao = {
  ensure,
  insert,
  getStoreRs,
  getStoreRsDetail,
  update,
  delete1,
  genRsPath
};