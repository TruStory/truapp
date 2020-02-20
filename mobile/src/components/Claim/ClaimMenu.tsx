import * as React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import NativeShareSheet from 'shared/components/Share/NativeShareSheet';
import { truToastError, truToastSuccess } from 'shared/components/Toast/TruToast';
import { flag_black } from 'shared/images/Flag/FlagImages';
import { share_black } from 'shared/images/Share/ShareImages';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { IconSize, Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';

export interface Props {
  claimId: ID;
  settings: Settings;
  style?: StyleProp<ViewStyle>;
  account?: Account;
}

const ClaimMenu = (props: Props) => {
  const { claimId, style } = props;
  const [ menuModalVisible, setMenuModalVisible ] = React.useState(false);

  const onFlagClaimAction = async () => {
    setMenuModalVisible(false);

    try {
      await Chain.flagStory({ claimId });
      truToastSuccess('Thanks for looking out and keeping our feed clean 👍');
    } catch (err) {
      truToastError(`We could not flag this claim: ${err}`);
    }
  };

  return (
      <View style={ [ styles.container, style ] }>
        <TouchableOpacity
          onPress={ () => setMenuModalVisible(true) }
          hitSlop={ { top: 20, bottom: 20, left: 20, right: 20 } }
        >
          <BaseIconView  family={ 'Feather' } name={ 'more-horizontal' } color={ Color.APP_BLACK } />
        </TouchableOpacity>
        <ActionSheet visible={ menuModalVisible } onCancel={ () => setMenuModalVisible(false) }>
          <View style={ { backgroundColor: Color.WHITE, paddingHorizontal: Whitespace.SMALL, paddingBottom: actionSheetBottomPadding } }>
            <BaseActionable
              style={ { padding: Whitespace.LARGE, flexDirection: 'row', alignItems: 'center' } }
              onAction={ onFlagClaimAction }
            >
              <BaseIconImageView
                source={ flag_black }
                style={ { marginRight: Whitespace.TINY } }
                size={ IconSize.XXSMALL }
              />
              <BaseText>Flag Claim</BaseText>
            </BaseActionable>
            <BaseLine />
            <NativeShareSheet
              message={ `${AppConfig.base_url}${AppConfig.share_route_urls.claim}${claimId}` }
              style={ { padding: Whitespace.LARGE, flexDirection: 'row', alignItems: 'center' } }
              onSelect={ () => setMenuModalVisible(false) }
            >
              <BaseIconImageView
                source={ share_black }
                style={ { marginRight: Whitespace.TINY } }
                size={ IconSize.XXSMALL }
              />
              <BaseText>Share Claim</BaseText>
            </NativeShareSheet>
          </View>
        </ActionSheet>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

ClaimMenu.defaultProps = {
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(ClaimMenu);
