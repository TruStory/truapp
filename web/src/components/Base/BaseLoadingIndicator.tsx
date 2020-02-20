
import * as React from 'react';
import Lottie from 'react-lottie';
import BaseView from 'shared/components/Base/BaseView';
import { FlexX, FlexY } from 'shared/styles';

interface Props {
  message: string;
}

const BaseLoadingIndicator = (props: Props) => {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('shared/lottie/Loading/Loading.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <BaseView flexX={ FlexX.CENTER } flexY={ FlexY.CENTER } paddingVertical={ true }>
      <Lottie
        options={ defaultOptions }
        height={ 75 }
        width={ 75 }
      />
    </BaseView>
  );
};

BaseLoadingIndicator.defaultProps = {
  message: 'Loading...',
};

export default BaseLoadingIndicator;
