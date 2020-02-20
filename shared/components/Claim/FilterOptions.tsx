import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { FeedFilter, FeedFilters } from 'shared/types/community';
import { feedFilters } from 'shared/utils/communities';

interface Props {
  style?: StyleProp<ViewStyle>;
  onChange: (filter: FeedFilters) => void;
  value: FeedFilters;
}

const FilterOptions = (props: Props) => {

  const { onChange, value, style } = props;

  const listJsx: React.ReactNode[] = [];
  feedFilters.map((filter: FeedFilter) => {
    listJsx.push(
      <BaseActionable style={ styles.option } onAction={ () => onChange(filter.id) }>
        <View style={ { flexDirection: 'column', flex: 1 } }>
          <BaseText textSize={ TextSize.H3 } color={ Color.APP_BLACK }>{ filter.name }</BaseText>
        </View>
        { value === filter.id && <BaseIconView
          name={ 'fiber-manual-record' }
          color={ Color.APP_PURPLE }
          size={ Whitespace.CONTAINER }
          family={ IconFamily.MATERIAL }
        /> }
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

export default FilterOptions;
