import React, { CSSProperties } from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import Select from 'react-select';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import COMMUNITIES_QUERY from 'shared/graphql/queries/communities.query';
import CommunitiesQuery, { CommunitiesQueryData } from 'shared/graphql/types/CommunitiesQuery';
import { Color } from 'shared/styles/colors';
import { Community } from 'shared/types/community';
import { Settings } from 'shared/types/settings';

interface Props {
  account: Account;
  settings: Settings;
  style?: CSSProperties;
  onChange: (community: Community) => void;
  value: string;
  includeHomepage?: boolean;
}

const customStyles = {
  control: (base: CSSProperties) => ({
    ...base,
    borderColor: Color.LINE_GRAY,
    color: Color.APP_BLACK,
    boxShadow: 'none',
    outline: 'none',
  }),
  option: (provided: CSSProperties, { isSelected, isFocused }: any) => ({
    ...provided,
    color: (isSelected || isFocused) ? Color.WHITE : Color.APP_BLACK,
    backgroundColor: (isSelected || isFocused) ? Color.APP_PURPLE : Color.WHITE,
  }),
  container: (provided: CSSProperties) => ({
    ...provided,
    width: '100%',
  }),
  placeholder: (provided: CSSProperties) => ({
    ...provided,
    color: 'rgba(168, 168, 168,0.75)',
  }),
  singleValue: (provided: CSSProperties) => ({
    ...provided,
    color: Color.APP_BLACK,
  }),
};

const CommunityDropdown = (props: Props) => {
  const { value, onChange, style, settings, account, includeHomepage } = props;

  const onSelected = (item: any) => onChange({ id: item.value, name: item.label, heroImage: '', iconImage: { regular: '', active: '' } });
  const onFocus = () => {  };

  const renderDropdown = (result: QueryResult<CommunitiesQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.communities) return <ErrorComponent onRefresh={ refetch } />;
    let communities: Community[] = data.communities;

    if (!settings.claimAdmins.includes(account.id)) {
      communities = communities.filter((community) => { return community.id !== 'debate2020'; });
    }

    const options = communities.map((community) => {
      return { value: community.id, label: community.name };
    });

    if (includeHomepage) {
      options.unshift({ value: 'all', label: 'Homepage' });
    }

    const selectedOption = options.filter((option) => option.value === value);

    return (
      <div style={ { ...styles.container, ...style } }>
        <Select
          isSearchable={ true }
          styles={ customStyles }
          placeholder='Select community...'
          value={ selectedOption }
          onChange={ onSelected }
          onFocus={ onFocus }
          options={ options }
          maxMenuHeight={ 200 }
        />
      </div>
    );
  };

  return (
    <CommunitiesQuery query={ COMMUNITIES_QUERY }>
      { renderDropdown }
    </CommunitiesQuery>
  );
};

const styles = {
  container: { },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(CommunityDropdown);
