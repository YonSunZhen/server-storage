import { ImgName } from '../../dao';

export interface GenrsPathNameParams {
  entityType: number;
  entityId: number;
  name: string;
  fileType?: string;
}

export function genImgName(name: string): ImgName{
  return {
    imgOriginName: name,
    imgThumName: `${name}_thum`,
    imgIntactName: `${name}_intact`
  };
}

export function genRsPathName(rsParams: GenrsPathNameParams): string {
  let res: string;
  const _entityType = rsParams.entityType;
  const _entityId = rsParams.entityId;
  const _name = rsParams.name;
  const _fileType = rsParams.fileType;
  if(_entityType === 1) {
    res = `/1_${_entityId}_${_name}`;
  } else if(_entityType === 2) {
    res = `/2_${_entityId}_${_name}.${_fileType}`;
  }
  return res;
}