// import fs from 'fs';
import path from 'path';
import fs from 'fs-extra';

export class Fs {

  private _baseUrl: string;
  constructor(baseUrl?: string) {
    this._baseUrl = baseUrl ? baseUrl : 'D:/uidq2225/Desktop/storage/server-storage/assets';
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
}