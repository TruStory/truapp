import React, { KeyboardEvent, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Routes } from '../../navigation/Routes';
import BaseTextInput from '../Base/BaseTextInput';

interface Props extends RouteComponentProps {
  style: React.CSSProperties;
}

const SearchInput = (props: Props) => {
  const { style, history, location } = props;

  const params = new URLSearchParams(location.search);
  const [ border, setBorder ] = React.useState(`1px solid ${Color.LINE_GRAY}`);
  const text = params.get('q');

  useEffect(() => {
    if (text === null) {
      setSearch('');
    }
  }, [text]);

  const [ search, setSearch ] = React.useState(text !== null ? text : '');
  const setSearchAction = (event: any) => setSearch(event.target.value);

  const onAction = () => {
    const queryString = search === '' ? '' : `?q=${search}`;
    history.push(`${Routes.SEARCH}${queryString}`);
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) onAction();
  };
  const onFocus = () => {
    setBorder(`1px solid ${Color.APP_PURPLE}`);
  };
  const onBlur = () => {
    setBorder(`1px solid ${Color.LINE_GRAY}`);
  };

  const renderClear = () => {
    if (search === '') return null;
    return (
      <BaseActionable
        onAction={ () => setSearch('') }
        style={ { position: 'absolute', right: 10, top: 7.5 } }
      >
        <BaseIconView
          name={ 'x' }
          color={ Color.GRAY }
          size={ IconSize.SMALL }
          family={ IconFamily.FEATHER }
        />
      </BaseActionable>
    );
  };

  return (
    <div style={ { ...styles.container, ...style } }>
      <BaseTextInput
        placeholder={ 'Enter any search term here' }
        value={ search }
        onKeyUp={ onKeyUp }
        onChange={ setSearchAction }
        style={ { ...styles.input, border } }
        onFocus={ onFocus }
        onBlur={ onBlur }
      />
      { renderClear() }
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    maxWidth: 700,
    justifyContent: 'center',
    position: 'relative' as 'relative',
  },
  input: {
    borderRight: 'none',
    padding: `2.5px ${Whitespace.LARGE + Whitespace.MEDIUM}px 2.5px ${Whitespace.MEDIUM}px`,
    borderRadius: Whitespace.LARGE,
  },
};

export default withRouter(SearchInput);
