import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AppAccountAvatarsPreview from 'shared/components/AppAccount/AppAccountAvatarsPreview';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import { isWeb } from 'shared/styles/utils';
import { AppAccountClaim, Claim, FeedClaim } from 'shared/types/claim';

interface Props {
  claim: FeedClaim | AppAccountClaim | Claim;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ClaimParticipants = (props: Props) => {
  const { claim, style } = props;

  return(
    <View style={ [ styles.container, style ] }>
      <AppAccountAvatarsPreview
        creators={ claim.participants }
        avatarCount={ 3 }
        size={ isWeb() ? AvatarSize.SMALL : 16 }
        style={ { marginRight: -2 } }
      />
    </View>
  );

};

const styles = StyleSheet.create({
  container: { },
});

export default ClaimParticipants;
