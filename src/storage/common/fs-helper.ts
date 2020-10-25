import fs from 'fs';

export class Fs {

  // constructor() {

  // }

  // 同步创建文件夹
  mkdirSync(path: string) {
    fs.mkdirSync(path);
  }

  // 同步读取文件
  readFileSync(path: string) {
    const res = fs.readFileSync(path);
    return res;
  }

  // 同步写文件
  writeFileSync(path: string, data: any) {
    fs.writeFileSync(path, data);
  }
}