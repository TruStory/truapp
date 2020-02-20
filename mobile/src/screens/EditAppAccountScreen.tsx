import { throttle } from 'lodash';
import { store } from 'mobile/App';
import AddImageComponent from 'mobile/src/components/AddImageComponent';
import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import NavigationService from 'mobile/src/utils/NavigationService';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { Dimensions, Image, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import { DevicePlatformType } from 'shared/blockchain/types';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { truToast } from 'shared/components/Toast/TruToast';
import APP_ACCOUNT_PROFILE_QUERY from 'shared/graphql/queries/app-account-profile.query';
import { removeAllDrafts } from 'shared/redux/actions/argument-draft.action';
import { logout } from 'shared/redux/actions/auth.action';
import { removeAllClaimDrafts } from 'shared/redux/actions/claim-draft.action';
import { removeAllCommentDrafts } from 'shared/redux/actions/comment-draft.action';
import { checkUsername, loginUser } from 'shared/services/auth';
import { TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Address } from 'shared/types/appAccount';
import { UsernameValidationResult } from 'shared/types/validation';
import ValidationUtil from 'shared/utils/validation';

interface NavigationParams extends WithApolloClient<any> {
  text: string;
  accountId: Address;
  disabled: boolean;
  fullName: string;
  bio: string;
  username: string;
  avatarURL: string;
}

interface Props extends NavigationScreenProps, WithApolloClient<any> {
  device: { token: string, platform: DevicePlatformType};
  account?: Account;
  logout: () => void;
  removeAllClaimDrafts: () => void;
  removeAllCommentDrafts: () => void;
  removeAllDrafts: () => void;
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const debouncedCheckUsername = throttle(checkUsername, 200);

const EditAppAccountScreen = (props: Props) => {

  const { navigation, account, client, device, logout, removeAllClaimDrafts, removeAllCommentDrafts, removeAllDrafts } = props;

  if (!account)
    return null;

  const [ fullName, setFullName  ] = React.useState(account.userProfile.fullName);
  const [ username, setUsername  ] = React.useState(account.userProfile.username);
  const [ bio, setBio  ] = React.useState(account.userProfile.bio);
  const [ avatarURL, setAvatarURL ] = React.useState(account.userProfile.avatarURL);
  const [ usernameValidated, setUsernameValidated ] = React.useState(true);

  const onChangeUsername = (text: string) => {
    if (text === account.userProfile.username) {
      setUsernameValidated(true);
      setUsername(text);
      return;
    }

    debouncedCheckUsername(text, (data?: UsernameValidationResult) => {
      if (data && ValidationUtil.validateUsername(text)) {
        setUsernameValidated( data.is_unique );
      } else {
        setUsernameValidated(false);
      }
    });
    setUsername(text);
  };

  React.useEffect(() => {
    navigation.setParams({ client, accountId: account.id });
  }, []);

  React.useEffect(() => {
    let disabled = false;
    if (!usernameValidated) {
      disabled = true;
    } else {
      disabled = !((fullName !== '' && fullName !== account.userProfile.fullName) ||
      (avatarURL !== account.userProfile.avatarURL) ||
      (bio !== account.userProfile.bio) ||
      (username !== account.userProfile.username));
    }

    navigation.setParams({ disabled, fullName, username, bio, avatarURL });
  }, [fullName, username, bio, avatarURL, usernameValidated]);

  const deregisterPushToken = async () => {
    try {
      if (device && device.token) {
        await Chain.unregisterDeviceToken(device.token, device.platform);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onLogout = () => {
    deregisterPushToken();
    removeAllClaimDrafts();
    removeAllCommentDrafts();
    removeAllDrafts();
    logout();
    NavigationService.navigate(Routes.Auth, { }, '');
  };

  return(
    <KeyboardAvoidingView
      behavior={ 'padding' }
      enabled={ Platform.OS === 'ios' }
      style={ styles.container }
      keyboardVerticalOffset={ calculateKeyboardOffset() }
    >
      <ScrollView style={ { paddingHorizontal: Whitespace.MEDIUM } }>
        <View style={ { flexDirection: 'row', alignItems: 'center' } }>
          <Image source={ { uri: avatarURL } } style={ { width: 75, height: 75, borderRadius: 37.5 } } />
          <AddImageComponent
            onLinkGenerated={ (link: string) => setAvatarURL(link) }
            style={ { marginLeft: Whitespace.SMALL } }
          >
            <BaseText color={ Color.APP_PURPLE }>Change Profile Image</BaseText>
          </AddImageComponent>
        </View>
        <View style={ styles.inputContainer }>
          <View style={ { width: 100, justifyContent: 'center' } }>
            <BaseText bold={ true } style={ { marginTop: Whitespace.LARGE - 2 } }>Name</BaseText>
          </View>
          <TextInput
            style={ [ styles.input ] }
            onChangeText={ (text: string) => setFullName(text) }
            value={ fullName }
            placeholder={ '' }
            autoCapitalize={ 'none' }
          />
        </View>
        <View style={ styles.inputContainer }>
          <View style={ { width: 100, justifyContent: 'center' } }>
            <BaseText bold={ true } style={ { marginTop: Whitespace.LARGE - 2 } }>Username</BaseText>
          </View>
          <TextInput
            style={ [ styles.input, { paddingRight: Whitespace.LARGE } ] }
            onChangeText={ onChangeUsername }
            value={ username }
            placeholder={ '' }
            autoCapitalize={ 'none' }
          />
          <BaseIconView
            name={ usernameValidated ? 'check' : 'x' }
            color={ usernameValidated ? Color.GREEN : Color.RED  }
            style={ { position: 'absolute', right: 0, top: Whitespace.MEDIUM, display: username === '' ? 'none' : 'flex' } }
          />
        </View>
        <View style={ styles.inputContainer }>
          <View style={ { width: 100, justifyContent: 'center' } }>
            <BaseText bold={ true } style={ { marginTop: Whitespace.LARGE + 2 } }>Bio</BaseText>
          </View>
          <TextInput
            style={ [ styles.input, { maxHeight: 200 } ] }
            onChangeText={ (text: string) => setBio(text) }
            value={ bio }
            multiline={ true }
            numberOfLines={ 5 }
            placeholder={ '' }
            autoCapitalize={ 'none' }
          />
        </View>
        <BaseActionable onAction={ () => navigation.navigate(Routes.SelectCommunities) }>
          <BaseText
            style={ { marginTop: Whitespace.MEDIUM } }
            color={ Color.APP_PURPLE }
          >
            Change My Followed Communities
          </BaseText>
        </BaseActionable>
        <BaseActionable onAction={ () => onLogout() }>
          <BaseText
            style={ { marginTop: Whitespace.MEDIUM } }
            color={ Color.RED }
          >
            Logout
          </BaseText>
        </BaseActionable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditAppAccountScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {

  const disabled = navigation.getParam('disabled');
  const fullName = navigation.getParam('fullName');
  const username = navigation.getParam('username');
  const bio = navigation.getParam('bio');
  const avatarURL = navigation.getParam('avatarURL');
  const id = navigation.getParam('accountId');

  const onSubmit = async () => {
    try {
      await Chain.updateUser({ full_name: fullName, username, bio, avatar_url: avatarURL });
      loginUser(store, true);

      const client = navigation.getParam('client');
      client.query({
        query: APP_ACCOUNT_PROFILE_QUERY,
        variables: { id },
        fetchPolicy: 'network-only',
      });

      navigation.goBack();
    } catch (err) {
      truToast(err.message);
    }
  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 } }>
        <BaseText bold={ true } align={ TextAlign.CENTER }>Edit Profile</BaseText>
      </View>
    ),
    headerRight: (
      <BaseActionable onAction={ onSubmit } disabled={ disabled } style={ { marginRight: Whitespace.MEDIUM } } >
        <BaseText color={ disabled ? Color.GRAY : Color.APP_PURPLE }>Save</BaseText>
      </BaseActionable>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: Whitespace.LARGE,
  },
  input: {
    width: Dimensions.get('screen').width - 130,
    alignSelf: 'stretch',
    textAlignVertical: 'center',
    textAlign: 'left',
    padding: 0,
    paddingBottom: Whitespace.SMALL,
    borderBottomColor: Color.LINE_GRAY,
    borderBottomWidth: 1,
    marginTop: Whitespace.LARGE,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    alignItems: 'flex-start',
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  device: state.device,
});

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch(logout()),
  removeAllClaimDrafts: () => dispatch(removeAllClaimDrafts()),
  removeAllDrafts: () => dispatch(removeAllDrafts()),
  removeAllCommentDrafts: () => dispatch(removeAllCommentDrafts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withApollo(EditAppAccountScreen));
