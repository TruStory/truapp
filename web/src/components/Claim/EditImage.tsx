import React from 'react';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { Color } from 'shared/styles/colors';
import { IconSize } from 'shared/styles/views';
import { WebImageUploader } from 'shared/utils/images';
import BaseText from '../Base/BaseText';

interface Props {
  style?: React.CSSProperties;
  size: IconSize;
  color: Color;
  title?: string;
  onUpload: (imageMarkdown: string) => void;
}

const EditImage = (props: Props) => {
  const { onUpload, style, color, title } = props;
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    LoadingBlanketHandler.show();

    try {
      const imageUploader = new WebImageUploader();
      const files = e.target.files;

      if (files !== null && files[0] !== undefined) {
        const resizedImage: Blob = await imageUploader.resizeImage(files[0]);
        const filename = imageUploader.generateRandomFileName();
        const uploadUrl = await imageUploader.getUploadUrl(filename);
        const imageFile = new File([resizedImage], filename);
        const link = await imageUploader.uploadImage(uploadUrl, imageFile, filename);
        onUpload(link);
      }
    } catch (err) {
      AlertModalHandler.alert('Oops', err.toString());
      LoadingBlanketHandler.hide();
    }
  };

  return (
    <label style={ { ...styles.label, ...style } }>
      <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center' } } className={ 'fade-in' }>
        <BaseText color={ color }>{ title ? title : 'Edit Image' }</BaseText>
      </div>
      <input
        style={ styles.input }
        type='file'
        onChange={ onChange }
        accept='image/png, image/jpeg'
      />
    </label>
  );
};

EditImage.defaultProps = {
  size: IconSize.REGULAR,
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

export default EditImage;
