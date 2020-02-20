import React, { CSSProperties } from 'react';
import { StyleSheet, View } from 'react-native';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { SlashArgumentReason, SlashArgumentReasonOption } from 'shared/types/slashing';
import { slashArgumentReasons } from 'shared/utils/slashing';

interface Props {
  style?: CSSProperties;
  onChange: (reason: SlashArgumentReason) => void;
  value: SlashArgumentReason;
}

const SlashArgumentOptions = (props: Props) => {

  const { onChange, value, style } = props;

  const listJsx: React.ReactNode[] = [];
  slashArgumentReasons.map((reason: SlashArgumentReasonOption) => {
    listJsx.push(
      <BaseActionable style={ styles.option } onAction={ () => onChange(reason.id) }>
        <View style={ { flexDirection: 'column', flex: 1 } }>
          <BaseText textSize={ TextSize.H4 } color={ Color.APP_BLACK }>{ reason.name }</BaseText>
        </View>
        <BaseIconView
          name={ value === reason.id ? 'check-circle' : 'radio-button-unchecked' }
          color={ value === reason.id ? Color.APP_PURPLE : Color.APP_BLACK }
          family={ IconFamily.MATERIAL }
        />
      </BaseActionable>,
      );
  });

  return (
    <View style={ [ styles.container, style ] }>
      { listJsx }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Whitespace.LARGE },
});

export default SlashArgumentOptions;
