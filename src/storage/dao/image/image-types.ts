export interface ImageDB extends ImgName {
  imgId?: number;
  imgType?: string;
  imgCreateAt?: Date;
  imgUpdateAt?: Date;
}

export interface ImgName {
  imgOriginName?: string;
  imgThumName?: string;
  imgIntactName?: string;
}