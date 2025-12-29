import { NextFunction, Request, Response } from 'express'

import { imageService } from '../services/imageService';



export const imageGetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const key = req.params.key;
    const handle = req.params.handle;
    let stream: NodeJS.ReadableStream;
    let contentType: string;

    console.log('key: ',key);
    console.log('handle: ', handle)

    if (handle) {
      ({ stream, contentType} = await imageService.getImageStream(key, handle));
    } else {
      ({ stream, contentType} = await imageService.getDefaultAvatarImage(key));
    }

    res.setHeader("Content-Type", contentType);
    stream.pipe(res);
  } catch (e) {
    return next(e);
  }
}