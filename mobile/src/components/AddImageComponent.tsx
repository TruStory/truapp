import MobileImageUploader from 'mobile/src/utils/images';
import * as React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';

interface Props {
  onLinkGenerated: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode | React.ReactNode[];
}

const AddImageComponent = (props: Props) => {
  const { onLinkGenerated, style, children } = props;

  const onSelectImage = async () => {
    LoadingBlanketHandler.show();
    const imageUploader = new MobileImageUploader();

    try {
      const imageURI = await imageUploader.selectImage();
      if (imageURI !== undefined) {
        const resizedImage = await imageUploader.resizeImage(imageURI);
        const filename = imageUploader.generateRandomFileName();
        const uploadUrl = await imageUploader.getUploadUrl(filename);
        const link = await imageUploader.uploadImage(uploadUrl, resizedImage, filename);
        onLinkGenerated(link);
      }
    } catch (e) {
      AlertModalHandler.alert('Oops', e);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  return (
    <TouchableOpacity onPress={ onSelectImage } style={ [ styles.container, style ] }>
      { children ? children : <BaseIconView name={ 'image' } family={ IconFamily.FEATHER } /> }
    </TouchableOpacity>
  );

};

const styles = StyleSheet.create({
  container: {  },
});

export default AddImageComponent;
