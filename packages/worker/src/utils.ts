import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import app from './firebase';

/**
 * Sleeps for a specified number of milliseconds
 */
export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const uploadImage = async (base64Data: string) => {
  const storage = getStorage(app);

  const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const blob = Buffer.from(base64, 'base64');

  const storageRef = ref(storage, `haiku-images/${uuidv4()}.jpeg`);

  const uploadTask = await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(uploadTask.ref);

  return downloadUrl;
};
