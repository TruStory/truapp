import * as React from 'react';
import { Share, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import BaseActionable from 'shared/components/Base/BaseActionable';

export interface Props {
  message: string;
  children: React.ReactNode | React.ReactNode[];
  style?: StyleProp<ViewStyle>;
  onSelect?: () => void;
}

const NativeShareSheet = (props: Props) => {
  const { message, style, children, onSelect } = props;

  const onShare = async () => {

    try {
      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    } finally {
      onSelect ? onSelect() : null;
    }
  };

  return (
    <BaseActionable
      onAction={ onShare }
      style={ [ styles.container, style ] }
    >
      { children }
    </BaseActionable>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

NativeShareSheet.defaultProps = {
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(NativeShareSheet);
