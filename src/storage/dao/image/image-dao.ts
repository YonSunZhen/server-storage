import { storage_db as db } from '../storage-db';
import { storage_logger as logger } from '@storage-logger';
import { ImageDB } from './image-types';
import { DaoType } from '../dao-types';
import { DataOptions, dbHelper } from '../utils';

const TABLE_NAME = 'image';

async function ensure() {
  if (!await db.schema.hasTable(TABLE_NAME)) {
    logger.info(`create table '${TABLE_NAME}' now...`);
    await db.schema.createTable(TABLE_NAME, (t) => {
      t.charset('utf8mb4');
      t.increments('imgId').primary().notNullable().comment('自增id');
      t.string('imgType', 50).defaultTo(null).comment('图片类型');
      t.string('imgOriginName', 50).defaultTo(null).comment('原始名称');
      t.string('imgThumName', 50).defaultTo(null).comment('缩略图名');
      t.string('imgIntactName', 50).defaultTo(null).comment('完整图名称');
      t.dateTime('imgCreateAt').defaultTo(null).comment('创建时间');
      t.dateTime('imgUpdateAt').defaultTo(null).comment('更新时间');
    }).catch((err) => logger.error(err));
  }
}

async function insert(options: ImageDB): Promise<number> {
  const _options = DataOptions(options);
  const res: number = await db.table(TABLE_NAME).insert(_options);
  return res;
}


export const image_dao = {
  ensure,
  insert
};