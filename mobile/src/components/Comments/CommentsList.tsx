import CommentItem from 'mobile/src/components/Comments/CommentItem';
import * as React from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl, StyleProp, StyleSheet, View } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Comment } from 'shared/types/comments';

interface CommentsListProps {
  selectedCommentId?: ID;
  account?: Account;
  claimComments: Comment[];
  style?: StyleProp<any> & React.CSSProperties;
}

interface MobileCommentsListProps extends CommentsListProps, NavigationScreenProps { }

const CommentsList = (props: MobileCommentsListProps) => {
  const { claimComments, style, selectedCommentId, navigation, account } = props;
  const listRef = React.useRef<FlatList<Comment>>(null);

  if (!account)
    return null;

  let scrollIndex = 0;

  React.useEffect(() => {
    if (listRef.current) {
      if (selectedCommentId && selectedCommentId > 0) {
        setTimeout(() => {
          if (listRef.current)
            listRef.current.scrollToIndex({ animated: false, index: scrollIndex });
        }, 750);

      } else {
        setTimeout(() => {
          if (listRef.current)
            listRef.current.scrollToEnd({ animated: selectedCommentId !== 0 });
        }, 750);
      }
    }
  }, [ selectedCommentId, listRef.current ]);

  const renderComment = (rowData: ListRenderItemInfo<Comment>) => {
    let selectedStyle = { backgroundColor: 'inherit', paddingTop: 0 };
    if (rowData.item.id === selectedCommentId) {
      selectedStyle.backgroundColor = Color.DARKER_HIGHLIGHT_PURPLE;
      selectedStyle.paddingTop =  Whitespace.CONTAINER;
      scrollIndex = rowData.index;
    } else {
      selectedStyle.backgroundColor = Color.TRANSPARENT;
    }

    return (
      <View style={ [ styles.commentContainer, selectedStyle ] }>
        <CommentItem comment={ rowData.item } />
      </View>
    );
  };

  // const preethiBounce = () => {

  //   return (
  //     <View style={ { justifyContent: 'center', alignItems: 'center' } }>
  //       <BaseText>You are all up to date! 🎉</BaseText>
  //     </View>
  //   );
  // };

  const keyExtractor = (item: Comment, index: number) => index.toString();

  return (
    <View style={ [ styles.container, style ] }>
      <FlatList
        refreshControl={ <RefreshControl tintColor={ Color.WHITE } refreshing={ false } onRefresh={ () => navigation.dismiss()  } /> }
        ref={ listRef }
        keyExtractor={ keyExtractor }
        data={ claimComments }
        initialNumToRender={ claimComments.length }
        renderItem={ renderComment }
        keyboardDismissMode={ 'interactive' }
        style={ { flex: 1 } }
        // style={ { flex: 1, marginBottom: -25 } }
        onScrollToIndexFailed={ (err: any) => console.log(err) }
        // ListFooterComponent={ preethiBounce() }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  commentContainer: {
    marginBottom: Whitespace.MEDIUM,
    paddingHorizontal: Whitespace.MEDIUM,
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withNavigation(connect(mapStateToProps)(CommentsList));
