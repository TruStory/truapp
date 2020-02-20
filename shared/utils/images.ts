import AppConfig from 'shared/app-config.json';
import ImageTools from 'shared/vendor/image-tools';

export class ImageUploader {
  protected maxWidth = 800;
  protected maxHeight = 800;
  protected quality = 100;
  protected uploaderUrl: string;
  protected s3BucketUrl: string;

  constructor(uploaderUrl: string, s3BucketUrl: string) {
    this.uploaderUrl = uploaderUrl;
    this.s3BucketUrl = s3BucketUrl;
  }

  generateRandomFileName() {
    return Math.random().toString(11).replace('0.', '') + '.jpg';
  }

  async getUploadUrl(imageName: string): Promise<string> {
    let r = await fetch(this.uploaderUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_name: imageName,
        content_type: 'image/jpeg',
      }),
    });

    let json = await r.json();
    return json.url;
  }

  uploadImage(uploadUrl: string, imageFile: File | string, imageName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(this.s3BucketUrl + imageName);
          } else {
            reject("We couldn't upload the file successfully.");
          }
        }
      };
      xhr.setRequestHeader('Content-Type', 'image/jpeg');
      xhr.send({ uri: imageFile, type: 'image/jpeg', name: imageName });
    });
  }
}

// tslint:disable-next-line: max-classes-per-file
export class WebImageUploader extends ImageUploader {
  constructor() {
    super(`${AppConfig.api.endpoint}/upload`, AppConfig.s3_bucket_url || '');
  }

  async resizeImage(file: File) {
    const imageTools = new ImageTools();
    const resizedImage = await imageTools.resize(file, {
      width: this.maxWidth,
      height: this.maxHeight,
    });
    return resizedImage;
  }

  uploadImage(uploadUrl: string, imageUri: File, imageName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(uploadUrl, {
        method: 'put',
        body: imageUri,
        headers: new Headers({
          'Content-Type': imageUri.type,
        }),
      }).then(() => {
        resolve(this.s3BucketUrl + imageName);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }
}
