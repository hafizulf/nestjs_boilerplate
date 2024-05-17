import * as FileType from 'file-type';
import * as fs from 'fs';

export const validateFileType = async (file: Express.Multer.File): Promise<boolean> => {
  const fileBuffer = fs.readFileSync(file.path);
  const fileType = await FileType.fromBuffer(fileBuffer);
  console.log(file);
  if (!fileType || !fileType.mime.startsWith('image')) {
    return false; // Not an image file
  }
  return true; // Image file
};
