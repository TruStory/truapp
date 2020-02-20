import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { removeClaimDraft } from 'shared/redux/actions/claim-draft.action';
import { ClaimDraft } from 'shared/redux/reducers/claim-draft.reducer';
import { TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';
import ValidationUtil from 'shared/utils/validation';

interface NavigationParams {
  tempId: ID;
  claimText: string;
  sourceText: string;
  communityId: string;
  removeClaimDraft: (tempId: ID) => void;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  claim_drafts: ClaimDraft[];
  removeClaimDraft: (tempId: ID) => void;
}

const AddClaimScreen4 = (props: Props) => {

  const { navigation, claim_drafts, removeClaimDraft } = props;
  const tempId = navigation.getParam('tempId');
  const find = claim_drafts.find((draft: ClaimDraft) => draft.tempId === tempId);

  const claimText = find && find.claimText ? find.claimText : '';
  const sourceText = find && find.sourceText ? find.sourceText : '-';
  const communityId = find && find.communityId ? find.communityId : '';

  React.useEffect(() => {
    navigation.setParams({ claimText, sourceText, removeClaimDraft, communityId });
  }, []);

  return (
    <ScrollView style={ styles.container }>
      <BaseText bold={ true }>Claim</BaseText>
      <BaseText style={ { marginTop: Whitespace.CONTAINER } }>{ claimText }</BaseText>
      <BaseText bold={ true } style={ { marginTop: Whitespace.MEDIUM + Whitespace.CONTAINER } } >Source</BaseText>
      <BaseText style={ { marginTop: Whitespace.CONTAINER } }>{ sourceText }</BaseText>
    </ScrollView>
  );

};

AddClaimScreen4.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const onFinish = async () => {

    const tempId = navigation.getParam('tempId');
    const claimText = navigation.getParam('claimText');
    const sourceText = navigation.getParam('sourceText');
    const communityId = navigation.getParam('communityId');
    const removeDraft = navigation.getParam('removeClaimDraft');

    LoadingBlanketHandler.show();
    try {
      const resp = await Chain.createClaim({
        body: claimText.trim(),
        source: ValidationUtil.prefixUrl(sourceText).trim(),
        communityId,
      });
      Analytics.track(AnalyticsEventsMobile.ClaimCreated, { claimdId : resp.id, community: resp.community_id });
      console.log('PUBLISH RESPONSE: ', resp);

      removeDraft(tempId);
      navigation.dismiss();
      navigation.navigate({
        routeName: Routes.ClaimStack,
        params: { claimId: +resp.id },
        key: `${Routes.Claim}-${resp.id}`,
      });
    } catch (err) {
      AlertModalHandler.alert('Oops', err.message);
    } finally {
      LoadingBlanketHandler.hide();
    }

  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 } }>
        <BaseText bold={ true } align={ TextAlign.CENTER }>Review</BaseText>
      </View>
    ),
    headerRight: (
      <BaseButton
        outline={ true }
        color={ Color.APP_PURPLE }
        accentColor={ Color.WHITE }
        style={ { paddingHorizontal: 0, paddingRight: Whitespace.SMALL } }
        title={ 'Post' }
        onAction={ onFinish }
        width={ 'auto' }
      />
      ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: Whitespace.SMALL,
    paddingRight: Whitespace.SMALL,
    paddingTop: Whitespace.MEDIUM,
  },
});

const mapStateToProps = (state: any) => {
  return {
    claim_drafts: state.claim_drafts.claim_drafts,
  };
};
const mapDispatchToProps = (dispatch: any) => ({
  removeClaimDraft: (tempId: ID) => {
    return dispatch(removeClaimDraft(tempId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClaimScreen4);
