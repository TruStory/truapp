import { Routes } from 'mobile/src/navigation/Routes';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, View, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import CLAIM_QUERY from 'shared/graphql/queries/claim.query';
import ClaimQuery, { ClaimQueryData } from 'shared/graphql/types/ClaimQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';

interface Props extends NavigationScreenProps {
  claimId: ID;
  header?: boolean;
  notification?: boolean;
  textSize?: TextSize;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ClaimHeader = (props: Props) => {
  const { navigation, claimId, style, notification, textSize, header } = props;

  const renderHeader = (result: QueryResult<ClaimQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading)
      return <BaseLoadingIndicator />;
    if (error || !data)
      return <ErrorComponent onRefresh={ refetch } />;

    const { claim } = data;

    if (notification) {
      return(
        <BaseActionable onAction={ () => navigation.navigate(Routes.Claim, { claimId }) } style={ style }>
          {/* <BaseText color={ Color.APP_PURPLE }>Claim</BaseText> */}
          <BaseText textSize={ textSize ? textSize : TextSize.H4 }>{ claim.body }</BaseText>
          <BaseText textSize={ TextSize.H6 } color={ Color.APP_PURPLE }>Tap here to see claim</BaseText>
        </BaseActionable>
      );
    }

    if (header) {
      return (
        <View style={ style }>
          <BaseText color={ Color.APP_PURPLE }>Claim</BaseText>
          <BaseText textSize={ textSize ? textSize : TextSize.H4 }>{ claim.body }</BaseText>
          <BaseLine style={ { marginTop: Whitespace.LARGE } } />
        </View>
      );
    }

    return <BaseText style={ style } textSize={ textSize ? textSize : TextSize.H4 }>{ claim.body }</BaseText>;
  };

  return (
    <ClaimQuery query={ CLAIM_QUERY } variables={ { claimId } }>
      { renderHeader }
    </ClaimQuery>
  );
};

export default withNavigation(ClaimHeader);
