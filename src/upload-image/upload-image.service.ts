/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './upload-image-response';
//import streamifier from 'streamifier'
const streamifier=require('streamifier')

@Injectable()
export class UploadImageService {

    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {

        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error)

                    if (!result) {
                        return reject(new Error('No se recibió respuesta de Cloudinary'));
                    }
                    resolve(result)
                }
            )
            streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
    }


}



