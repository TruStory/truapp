import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import BaseView from 'shared/components/Base/BaseView';
import { FlexX, FlexY } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props {
  message: string;
  size: 'small' | 'large';
}

const BaseLoadingIndicator = (props: Props) => {
  const { message, size } = props;

  return (
    <BaseView flexX={ FlexX.CENTER } flexY={ FlexY.CENTER } paddingVertical={ true }>
      <ActivityIndicator
        size={ size }
        color={ Color.APP_PURPLE }
      />
      <BaseText style={ { marginLeft: Whitespace.MEDIUM } }>{ message }</BaseText>
    </BaseView>
  );
};

BaseLoadingIndicator.defaultProps = {
  message: 'Loading...',
  size: 'large',
};

export default BaseLoadingIndicator;
