import React, { CSSProperties } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Select from 'react-select';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import { IconSize, Whitespace } from 'shared/styles/views';
import { ArgumentSort, ArgumentSorts } from 'shared/types/argument';
import { argumentSortActiveImageMap, argumentSortInactiveImageMap, argumentSorts } from 'shared/utils/arguments';

interface Props extends RouteComponentProps {
  style?: CSSProperties;
  onChange: (ArgumentSort: ArgumentSorts) => void;
  value: ArgumentSorts;
}

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
};

const ArgumentSortDropdown = (props: Props) => {
  const { style, onChange, value } = props;

  const onChangeAction = (item: any) => onChange(item.value);
  const options = argumentSorts.map((filter: ArgumentSort) => {
    const image = value === filter.id ? argumentSortActiveImageMap.get(filter.id) : argumentSortInactiveImageMap.get(filter.id);

    return {
      value: filter.id,
      label: (
        <div style={ { display: 'flex', alignItems: 'center' } } key={ filter.id }>
          <BaseIconImageView source={ image } size={ IconSize.SMALL } style={ { marginRight: Whitespace.SMALL } } />
          <BaseText color={ value === filter.id ? Color.APP_PURPLE : Color.APP_BLACK } textSize={ TextSize.H5 }>{ filter.name }</BaseText>
        </div>
      ),
    };
  });

  const selectedOption = options.filter((option) => option.value === value);

  return (
    <div style={ { ...styles.container, ...style } }>
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

export default withRouter(ArgumentSortDropdown);
