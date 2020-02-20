import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Community } from 'shared/types/community';
import { Settings } from 'shared/types/settings';
import CommunityDropdown from '../Communities/CommunityDropdown';

interface Props {
  account: Account;
  settings: Settings;
  claimId: ID;
  onSubmit: (claimId: ID, communityId: string) => void;
  onClose: () => void;
}

const FeatureClaimModal = (props: Props) => {

  const { onClose, onSubmit, claimId } = props;
  const [communityId, setCommunityId] = React.useState('all');
  let contentJsx: React.ReactNode | React.ReactNode[];

  const updateCommunityId = (community: Community) => {
    const { id } = community;
    setCommunityId(id);
  };

  const onSubmitAction = () => onSubmit(claimId, communityId);

  contentJsx = (
      <React.Fragment>
        <div className={ 'columns is-centered' }>
            <div className={ 'column is-12-desktop' }>
                <CommunityDropdown
                    onChange={ updateCommunityId }
                    value={ communityId }
                    includeHomepage={ true }
                    style= { { marginBottom: Whitespace.MEDIUM } }
                />
                <BaseButton
                    title={ 'Update' }
                    outline={ false }
                    accentColor={ Color.APP_PURPLE }
                    color={ Color.WHITE }
                    onAction={ onSubmitAction }
                />
            </div>
        </div>
      </React.Fragment>
    );

  return (
  <View>
    <View style={ { flexDirection: 'row', alignItems: 'center', flex: 1, marginBottom: Whitespace.LARGE } }>
      <View style={ { flexDirection: 'row', flex: 1, justifyContent: 'center' } }>
        <BaseText
          color={ Color.APP_BLACK }
          textSize={ TextSize.H2 }
          bold={ true }
          style={ { marginRight: -Whitespace.LARGE } }
        >
          Feature Claim
        </BaseText>
      </View>
      <BaseActionable onAction={ onClose } style={ { alignItems: 'flex-end' } }>
        <BaseIconView family={ 'Feather' } name={ 'x' } />
      </BaseActionable>
    </View>
    { contentJsx }
  </View>
  );
};

// const styles = {
//   markdownControlContainer: {
//     justifyContent: 'space-between',
//     width: 275,
//   },
//   sectionContainer: {
//     border: `1px solid ${Color.LINE_GRAY}`,
//     padding: Whitespace.MEDIUM,
//     borderRadius: Whitespace.TINY,
//     marginBottom: Whitespace.SMALL,
//   },
//   input: {
//     borderBottom: `1px solid ${Color.LINE_GRAY}`,
//     paddingBottom: Whitespace.SMALL,
//     marginTop: Whitespace.TINY,
//   },
// };

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(FeatureClaimModal);
