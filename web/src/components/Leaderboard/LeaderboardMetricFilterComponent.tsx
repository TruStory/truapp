import React, { CSSProperties } from 'react';
import Select from 'react-select';
import BaseText from 'shared/components/Base/BaseText';
import { LeaderboardMetricFilterProps } from 'shared/components/Leaderboard/LeaderboardMetricFilterComponent';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import { LeaderboardMetricFilter } from 'shared/types/leaderboard';
import { leaderboardMetricFilters } from 'shared/utils/leaderboard';

const customStyles = {
  control: (base: CSSProperties) => ({
    ...base,
    borderColor: Color.APP_PURPLE,
    boxShadow: 'none',
    outline: 'none',
  }),
  option: (provided: CSSProperties, { isSelected, isFocused }: any) => ({
    ...provided,
    color: (isSelected || isFocused) ? (isSelected ? Color.WHITE : Color.APP_PURPLE) : Color.APP_BLACK,
    backgroundColor: (isSelected || isFocused) ? ( isSelected ? Color.LIGHT_PURPLE : Color.HIGHLIGHT_PURPLE ) : Color.WHITE,
    fontSize: WebFontSize.H5,
    lineHeight: `${WebLineHeight.H5}px`,
  }),
  container: (provided: CSSProperties) => ({
    ...provided,
    width: '150px',
  }),
  placeholder: (provided: CSSProperties) => ({
    ...provided,
    color: 'rgba(168, 168, 168,0.75)',
  }),
  singleValue: (provided: CSSProperties) => ({
    ...provided,
    color: Color.APP_PURPLE,
    fontSize: WebFontSize.H5,
    lineHeight: WebLineHeight.H5,
  }),
  indicatorSeparator: (provided: CSSProperties) => ({
    ...provided,
    display: 'none',
  }),
  dropdownIndicator: (provided: CSSProperties) => ({
    ...provided,
    color: Color.APP_PURPLE,
  }),
  menu: (provided: CSSProperties) => ({
    ...provided,
    zIndex: 3,
  }),
};

const LeaderboardMetricFilterComponent = (props: LeaderboardMetricFilterProps) => {
  const { onChange, value } = props;

  const onChangeAction = (item: any) => onChange(item.value);
  const options = leaderboardMetricFilters.map((filter: LeaderboardMetricFilter) => {

    return {
      value: filter.id,
      label: (
      <div style={ { display: 'flex', alignItems: 'center' } } >
        <BaseText color={ value === filter.id ? Color.APP_PURPLE : Color.APP_BLACK } textSize={ TextSize.H5 }>{ filter.name }</BaseText>
      </div>
      ),
    };
  });

  const selectedOption = options.filter((option) => option.value === value);

  return (
    <div style={ { ...styles.container } }>
      <Select
        isSearchable={ false }
        styles={ customStyles }
        placeholder='Select filter'
        value={ selectedOption }
        onChange={ onChangeAction }
        options={ options }
      />
    </div>
  );
};

const styles = {
  container: { display: 'flex', alignItems: 'center' },
};

export default LeaderboardMetricFilterComponent;
