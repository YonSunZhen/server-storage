import { folder_dao } from './folder';
import { store_rs_dao } from './store-rs';
import { image_dao } from './image';

export async function initDB() {
  await folder_dao.ensure();
  await store_rs_dao.ensure();
  await image_dao.ensure();
}