import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Argument } from 'shared/types/argument';
import { Settings } from 'shared/types/settings';

export interface ArgumentMenuProps {
  argument: Argument;
  settings: Settings;
  onFlagArgument?: (argumentId: ID) => void;
  style?: React.CSSProperties;
  account?: Account;
}

const ArgumentMenu = (props: ArgumentMenuProps) => {
  const { argument, style } = props;
  const [ menuModalVisible, setMenuModalVisible ] = React.useState(false);

  const onEditAction = () => {  };

  return (
      <View style={ [ styles.container, style ] }>
        <BaseActionable onAction={ () => setMenuModalVisible(true) }>
          <BaseIconView  family={ 'Feather' } name={ 'more-horizontal' } color={ Color.APP_BLACK } />
        </BaseActionable>
        <ActionSheet visible={ menuModalVisible } onCancel={ () => setMenuModalVisible(false) } swipeToClose={ false }>
          <View style={ { backgroundColor: Color.WHITE, paddingBottom: actionSheetBottomPadding } }>
            <BaseActionable onAction={ onEditAction } style={ { padding: Whitespace.LARGE } }>
              <BaseText>Flag Claim</BaseText>
            </BaseActionable>
          </View>
        </ActionSheet>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(ArgumentMenu);
