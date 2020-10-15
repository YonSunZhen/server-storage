export interface StoreRsDB {
  rsId?: string;
  entityType?: number; // 1folder 2image
  entityId?: number;
  rsPath?: string;
  rsNo?: string;
  rsParentNo?: string;
  rsCreateAt?: Date;
  rsStatus?: number; // 0删除 1存在
}