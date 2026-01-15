import { v4 as uuidv4 } from 'uuid'

export function uuidGenerator(): string {
  const uniqueId: string = uuidv4();
  return uniqueId;
}