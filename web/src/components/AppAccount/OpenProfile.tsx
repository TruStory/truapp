import * as React from 'react';
import { StyleSheet } from 'react-native';
import { RouteComponentProps, withRouter } from 'react-router';
import BaseActionable from 'shared/components/Base/BaseActionable';
import { Creator } from 'shared/types/appAccount';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  appAccount: Creator;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const OpenProfile = (props: Props) => {
  const { appAccount, children, style, history } = props;

  const onGoToProfile = () => history.push(`${Routes.PROFILE}${appAccount.id}`);

  return (
    <BaseActionable style={ [ styles.container, style ] } onAction={ onGoToProfile }>
      { children }
    </BaseActionable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
  },
});

export default withRouter(OpenProfile);
