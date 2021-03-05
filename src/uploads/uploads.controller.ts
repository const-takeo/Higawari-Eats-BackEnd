import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { UploadsModuleOptions } from './uploads.interfaces';

//DONT FORGET THIS BUCKET NAME
//bucketは最初に一回だけ作れば良い
//It needs unique name
const BUCKET_NAME = 'kimchinattobutaitameoishii';

@Controller('uploads')
export class UploadsController {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: UploadsModuleOptions,
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.options.privateKey,
        secretAccessKey: this.options.secretKey,
      },
    });
    try {
      const objectName = `${Date.now() + file.originalname}`;
      await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          //It needs unique name
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (error) {
      return null;
    }
  }
}
