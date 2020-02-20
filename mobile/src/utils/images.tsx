import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import AppConfig from 'shared/app-config.json';
import { ImageUploader } from 'shared/utils/images';

class MobileImageUploader extends ImageUploader {
  constructor() {
    super(`${AppConfig.chain_url}${AppConfig.api.endpoint}/upload`, AppConfig.s3_bucket_url);
  }

  selectImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      ImagePicker.showImagePicker({
        title: 'Select Image',
        storageOptions: { skipBackup: true, path: 'images' },
      },
      (response: any) => {
        if (response.uri) {
          resolve(response.uri);
        } else if (response.error) {
          reject(response.error);
        } else {
          resolve();
        }
      });
    });
  }

  async resizeImage(imageUri: string) {
    const response = await ImageResizer.createResizedImage(
      imageUri,
      this.maxWidth,
      this.maxHeight,
      'JPEG',
      this.quality);
    return response.uri;
  }
}

export default MobileImageUploader;
