export interface StoreRsDB {
  rsId?: string;
  entityType?: number; // 1image 2folder
  entityId?: number;
  rsPath?: string;
  rsNo?: string;
  rsParentNo?: string;
  rsCreateAt?: Date;
  rsStatus?: number; // 0删除 1存在
}