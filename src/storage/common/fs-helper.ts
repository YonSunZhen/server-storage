// import fs from 'fs';
import path from 'path';
import fs from 'fs-extra';
import images from 'images';

export class Fs {

  private _baseUrl: string;
  constructor(baseUrl?: string) {
    // const _baseUrlConfig = config.get<string>('baseUrl');
    const _baseUrlConfig = path.join(__dirname, '../../../assets');
    this._baseUrl = baseUrl ? baseUrl : _baseUrlConfig;
  }

  // 同步创建文件夹
  async mkdirSync(url: string) {
    await fs.promises.mkdir(url);
  }

  // 同步读取文件
  async readFileSync(url: string) {
    const res = await fs.promises.readFile(url);
    return res;
  }

  // 同步写文件
  async writeFileSync(url: string, data: any) {
    await fs.promises.writeFile(url, data);
  }

  // 判断给定路径是否存在
  existsSync(url: string) {
    const res = fs.existsSync(url);
    return res;
  }

  // 获取文件夹的直接子文件或子目录
  readDirSync(url: string) {
    const res = fs.readdirSync(url);
    return res;
  }

  // 判断路径是否是文件夹
  isDirectory(url: string) {
    const res = fs.statSync(url).isDirectory();
    return res;
  }

  // 删除文件
  delFile(url: string) {
    fs.unlinkSync(url);
  }

  // 删除文件夹
  delFolder(url: string) {
    fs.rmdirSync(url, {recursive: true});
  }

  remove(url: string) {
    fs.removeSync(url);
  }

  // 更改文件名
  rename(oldUrl: string, newUrl: string) {
    const _oldUrl = path.join(this._baseUrl, oldUrl);
    const _newUrl = path.join(this._baseUrl, newUrl);
    fs.renameSync(_oldUrl, _newUrl);
  }

  deleteFolderRecursive(url: string) {
    const _url = path.join(this._baseUrl, url);
    this.remove(_url);
    // if(this.existsSync(_url)) {
    //   if(this.isDirectory(_url)) {
    //     const files = this.readDirSync(_url);
    //     files.forEach(f => {
    //       const _f = `${url}${f}\\`;
    //       this.deleteFolderRecursive(_f);
    //     });    
    //     // 不执行 this.readDirSync(_url) 报错???
    //     if(this.readDirSync(_url).length === 0) {
    //       this.delFolder(_url);
    //     } else {
    //       this.deleteFolderRecursive(url);
    //     }
    //   } else {
    //     this.delFile(_url);
    //   }
    // }
  }
  /**
   * 压缩图片并存储
   * @param imgUrl 原图片路径
   * @param outUrl 缩略图输出路径
   * @param quality 图片质量 50
   * @param type 图片格式 目前支持设置JPG图像质量
   */
  async compressImg(imgUrl: string, outUrl: string, quality = 50, type = 'jpg' as any,): Promise<images.Image> {
    const _outUrl = path.join(this._baseUrl, outUrl);
    return new Promise((resolve, reject) => {
      const _image = images(imgUrl).saveAsync(_outUrl, 'jpg', {quality: quality}, (err) => {
        if(err) {
          console.log(err);
          reject(err);
        } else {
          resolve(_image);
        }
      });
    });
  }
}