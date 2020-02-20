import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import React, { useEffect } from 'react';
import { QueryResult } from 'react-apollo';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import CommunityTitle, { CommunityTitleSize } from 'shared/components/Communities/CommunityTitle';
import ErrorComponent from 'shared/components/ErrorComponent';
import COMMUNITIES_QUERY from 'shared/graphql/queries/communities.query';
import CommunitiesQuery, { CommunitiesQueryData } from 'shared/graphql/types/CommunitiesQuery';
import { addClaimDraftCommunity } from 'shared/redux/actions/claim-draft.action';
import { ClaimDraft } from 'shared/redux/reducers/claim-draft.reducer';
import { TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Community } from 'shared/types/community';
import { Settings } from 'shared/types/settings';

interface NavigationParams {
  tempId: ID;
  communityId: string;
  settings: Settings;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  claim_drafts: ClaimDraft[];
  addClaimDraftCommunity: (tempId: ID, communityId: string) => void;
}

const AddClaimScreen2 = (props: Props) => {

  const { navigation, addClaimDraftCommunity, claim_drafts } = props;
  const tempId = navigation.getParam('tempId');
  const settings = navigation.getParam('settings');
  const find: ClaimDraft | undefined = claim_drafts.find((draft: ClaimDraft) => draft.tempId === tempId);
  const [ communityId, setCommunityId ] = React.useState(find && find.communityId ? find.communityId : '');
  const [ reload, setReload ] = React.useState(1);

  useEffect(() => {
    navigation.setParams({ communityId });
  }, []);

  const renderDropdown = (result: QueryResult<CommunitiesQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.communities) return <ErrorComponent onRefresh={ refetch } />;
    const communities: Community[] = data.communities;

    const keyExtractor = (item: Community, index: number) => index.toString();

    const renderCommunity = (rowData: ListRenderItemInfo<Community>) => {
      const onAction = () => {
        addClaimDraftCommunity(tempId, rowData.item.id);
        setCommunityId(rowData.item.id);
        setReload(reload + 1);
        navigation.setParams({ communityId: rowData.item.id });
        navigation.navigate(Routes.AddClaimScreen3, { tempId, settings });
      };

      const renderIcon = () => {
        if (rowData.item.id === communityId)
          return <BaseIconView name={ 'check-circle' } color={ Color.APP_PURPLE } />;
        return null;
      };

      return (
        <React.Fragment>
          <BaseActionable onAction={ onAction } style={ { paddingVertical: Whitespace.MEDIUM, flexDirection: 'row' } } >
            <CommunityTitle community={ rowData.item }  size={ CommunityTitleSize.REGULAR } style={ { flex: 1 } } />
            { renderIcon() }
          </BaseActionable>
          <BaseLine />
        </React.Fragment>
      );
    };

    return (
      <View style={ { paddingHorizontal: Whitespace.SMALL , paddingBottom: actionSheetBottomPadding } }>
        <FlatList
          keyExtractor={ keyExtractor }
          showsVerticalScrollIndicator={ false }
          data={ communities }
          renderItem={ renderCommunity }
        />
      </View>
    );
  };

  return (
    <CommunitiesQuery query={ COMMUNITIES_QUERY } variables={ { reload } } fetchPolicy={ 'no-cache' }>
      { renderDropdown }
    </CommunitiesQuery>
  );
};

AddClaimScreen2.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const settings: Settings = navigation.getParam('settings');
  const onNext = () => {
    const tempId = navigation.getParam('tempId');
    const communityId = navigation.getParam('communityId');
    if (communityId !== '') {
      navigation.navigate(Routes.AddClaimScreen3, { tempId, settings });
    } else {
      AlertModalHandler.alert('Oops!', 'Please select a community');
    }
  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 } }>
        <BaseText bold={ true } align={ TextAlign.CENTER }>Select Community</BaseText>
      </View>
    ),
    headerRight: (
      <BaseButton
        outline={ true }
        color={ Color.APP_PURPLE }
        accentColor={ Color.WHITE }
        style={ { paddingHorizontal: 0, paddingRight: Whitespace.SMALL } }
        title={ 'Next' }
        onAction={ onNext }
        width={ 'auto' }
      />
      ),
  };
};

const mapStateToProps = (state: any) => {
  return {
    claim_drafts: state.claim_drafts.claim_drafts,
  };
};
const mapDispatchToProps = (dispatch: any) => ({
  addClaimDraftCommunity: (tempId: ID, communityId: string) => {
    return dispatch(addClaimDraftCommunity(tempId, communityId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClaimScreen2);
