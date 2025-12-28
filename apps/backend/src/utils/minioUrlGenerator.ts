import { v4 as uuidv4 } from 'uuid'; 

export function avatarUrlGenerator(handle: string): string {
  const uuid = uuidv4();
  const objectKey: string = handle + '/' + uuid;
  return objectKey;
}

