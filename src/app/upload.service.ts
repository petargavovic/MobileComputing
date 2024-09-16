import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

storage = inject(Storage);

generateImagePath(image: any): string {
  const userId = 'your-user-id'; // Replace with your actual user ID logic
  const timestamp = new Date().getTime();
  const fileExtension = 'jpeg'; // Assuming the image is always JPEG
  return `images/${userId}/${timestamp}.${fileExtension}`;
}

async uploadImage(blob: Blob, path: string): Promise<string> {
  const storageRef = ref(this.storage, path);
  const uploadTask = await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(uploadTask.ref);
  return downloadUrl;
}

dataURLtoBlob(dataUrl: string): Blob {
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

}
