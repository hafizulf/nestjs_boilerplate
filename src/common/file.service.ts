import * as path from 'path';
import * as fs from 'fs-extra';
import { unlink } from 'fs-extra';
import { HttpException } from '@nestjs/common';

export class FileService {
  public static store(file: Express.Multer.File, destination: string): string {
    if (!destination) {
      throw new Error('Destination directory is not specified.');
    }

    const destinationPath = path.join(
      'storage',
      destination,
      `${file.filename}.${file.originalname}`,
    );
    fs.moveSync(file.path, destinationPath);
    return destinationPath;
  }

  public static destroy(path: string): boolean {
    try {
      if (fs.existsSync(path)) {
        unlink(path);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  public static update(
    file: Express.Multer.File,
    destination: string,
    oldFile?: string,
  ): string {
    if (oldFile) {
      if (fs.pathExistsSync(oldFile)) {
        unlink(oldFile)
          .then(() => {
            console.info('Old file deleted');
          })
          .catch((err) => {
            throw new HttpException(err.message, 500);
          });
      }
    }

    const destinationPath = path.join(
      'storage',
      destination,
      `${file.filename}.${file.originalname}`,
    );
    fs.moveSync(file.path, destinationPath);
    return destinationPath;
  }
}
