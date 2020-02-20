import React, { CSSProperties } from 'react';
import Select from 'react-select';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import { SlashArgumentReason, SlashArgumentReasonOption } from 'shared/types/slashing';
import { slashArgumentReasons } from 'shared/utils/slashing';

interface Props {
  style?: CSSProperties;
  onChange: (reason: SlashArgumentReason) => void;
  value: SlashArgumentReason;
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
    width: '320px',
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

const SlashArgumentOptions = (props: Props) => {
  const { style, onChange, value } = props;

  const onChangeAction = (item: any) => onChange(item.value);
  const reasons = [{ id: -1, name: 'Select a reason...' }].concat(slashArgumentReasons);
  const options = reasons.map((reason: SlashArgumentReasonOption) => {
    return {
      value: reason.id,
      label: (
        <div style={ { display: 'flex', alignItems: 'center' } } key={ reason.id }>
          <BaseText color={ value === reason.id ? Color.APP_PURPLE : Color.APP_BLACK } textSize={ TextSize.H5 }>{ reason.name }</BaseText>
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
        menuPlacement={ 'top' }
      />
    </div>
  );
};

const styles = {
  container: { display: 'flex', alignItems: 'center' },
};

export default SlashArgumentOptions;
