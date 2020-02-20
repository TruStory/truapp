import React from 'react';
import { QueryResult } from 'react-apollo';
import { FlatList, Image, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ArgumentItem from 'shared/components/Argument/ArgumentItem';
import ScrollTo from 'shared/components/Argument/ScrollTo';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import ARGUMENTS_QUERY from 'shared/graphql/queries/arguments.query';
import ArgumentsQuery, { ArgumentsQueryData } from 'shared/graphql/types/ArgumentsQuery';
import { argument_empty } from 'shared/images/Argument/ArgumentImages';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Argument, ArgumentSorts } from 'shared/types/argument';

interface Props {
  claimId: ID;
  selectedArgumentId?: ID;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  sort: ArgumentSorts;
}

const ArgumentList = (props: Props) => {
  const { claimId, style, selectedArgumentId, sort } = props;

  const renderArgumentList = (result: QueryResult<ArgumentsQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const { claimArguments } = data;
    const renderArgument = (rowData: ListRenderItemInfo<Argument>) => {
      return(
        <ScrollTo
          id={ rowData.item.id }
          selectedId={ selectedArgumentId }
          container={ window }
        >
          <ArgumentItem
            argument={ rowData.item }
            style={ { marginBottom: Whitespace.LARGE + 12 } }
            opened={ selectedArgumentId === rowData.item.id }
          />
        </ScrollTo>
      );
    };

    if (claimArguments.length === 0) {
      return (
        <View style={ { justifyContent: 'center', flexDirection: 'column' } }>
          <Image source={ argument_empty } style={ { width: '100%', resizeMode: 'contain', height: 200 } } />
          <BaseText
            align={ TextAlign.CENTER }
            style={ { paddingTop: Whitespace.SMALL } }
            bold={ true }
            color={ Color.GRAY }
          >
            No Arguments
          </BaseText>
          <BaseText
            textSize={ TextSize.H5 }
            align={ TextAlign.CENTER }
            style={ { paddingBottom: Whitespace.SMALL } }
            color={ Color.GRAY }
          >
            Be the first to write one!
          </BaseText>
        </View>
      );
    }

    const keyExtractor = (item: Argument, index: number) => index.toString();

    return (
      <View style={ style }>
        <FlatList
          keyExtractor={ keyExtractor }
          data={ claimArguments }
          renderItem={ renderArgument }
          contentContainerStyle={ styles.container }
        />
      </View>
    );
  };

  return (
    <ArgumentsQuery query={ ARGUMENTS_QUERY } variables={ { claimId, sort, cacheBuster: selectedArgumentId } } fetchPolicy={ 'network-only' }>
      { renderArgumentList }
    </ArgumentsQuery>
  );

};

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
});

export default ArgumentList;
