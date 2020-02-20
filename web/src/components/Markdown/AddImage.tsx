import React from 'react';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { Color } from 'shared/styles/colors';
import { IconSize } from 'shared/styles/views';
import { WebImageUploader } from 'shared/utils/images';

interface Props {
  style?: React.CSSProperties;
  size: IconSize;
  color: Color;
  onUpload: (imageMarkdown: string) => void;
}

const AddImage = (props: Props) => {
  const { onUpload, style, color, size } = props;

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    LoadingBlanketHandler.show();

    try {
      const imageUploader = new WebImageUploader();
      const files = e.target.files;

      if (files !== null && files[0] !== undefined) {
        const resizedImage: Blob = await imageUploader.resizeImage(files[0]);
        const filename = imageUploader.generateRandomFileName();
        const uploadUrl = await imageUploader.getUploadUrl(filename);

        let imageFile: any = new File([resizedImage], filename);

        // edge and IE support
        if (/Edge\/\d./i.test(navigator.userAgent) ||
          /MSIE 10/i.test(navigator.userAgent) ||
          /MSIE 9/i.test(navigator.userAgent) ||
          /rv:11.0/i.test(navigator.userAgent)) {
          imageFile = new Blob([resizedImage], { type: 'image/jpeg' });
        }

        const link = await imageUploader.uploadImage(uploadUrl, imageFile, filename);
        const markdown = `![Image](${link})`;

        onUpload(markdown);
      }
    } catch (err) {
      AlertModalHandler.alert('Oops', err.toString());
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  return (
    <label style={ { ...styles.label, ...style } }>
      <BaseIconView
        size={ size }
        name='image'
        color={ color }
      />
      <input
        style={ styles.input }
        type='file'
        onChange={ onChange }
        accept='image/png, image/jpeg'
      />
    </label>
  );
};

AddImage.defaultProps = {
  color: Color.APP_BLACK,
};

const styles = {
  label: {
    cursor: 'pointer',
  },
  input: {
    opacity: 0,
    position: 'absolute' as 'absolute',
    zIndex: - 1,
  },
};

export default AddImage;
