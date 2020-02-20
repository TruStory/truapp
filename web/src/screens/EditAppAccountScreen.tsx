import { throttle } from 'lodash';
import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import Avatar from 'shared/components/AppAccount/Avatar';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import CharacterCount from 'shared/components/CharacterCount';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { checkUsername } from 'shared/services/auth';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isLargerThanTablet } from 'shared/styles/utils';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import { UsernameValidationResult } from 'shared/types/validation';
import ValidationUtil from 'shared/utils/validation';
import BaseTextArea from '../components/Base/BaseTextArea';
import BaseTextInput from '../components/Base/BaseTextInput';
import EditImage from '../components/Claim/EditImage';
import CommunitiesDetailedList from '../components/Communities/CommunitiesDetailedList';
import { truToast } from '../components/Toast/TruToast';
import { Routes } from '../navigation/Routes';
import { generateDocumentTitle } from '../utils';

interface Props extends RouteComponentProps {
  account?: Account;
  settings: Settings;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const debouncedCheckUsername = throttle(checkUsername, 200);

const EditAccountScreen = (props: Props) => {
  const { account, style, history } = props;
  generateDocumentTitle('Edit Profile');

  if (!account) {
    history.push(Routes.LOGIN);
    return null;
  }

  const [ fullName, setFullName  ] = React.useState(account.userProfile.fullName);
  const [ username, setUsername  ] = React.useState(account.userProfile.username);
  const [ bio, setBio  ] = React.useState(account.userProfile.bio);
  const [ avatarURL, setAvatarURL ] = React.useState(account.userProfile.avatarURL);
  const [ usernameValidated, setUsernameValidated ] = React.useState(true);

  const onSubmit = async () => {
    try {
      await Chain.updateUser({ full_name: fullName, username, bio, avatar_url: avatarURL });
      location.reload();
    } catch (err) {
      truToast(err.message);
    }
  };

  const onImageUpload = (link: string) => {
    try {
      setAvatarURL(link);
    } catch (err) {
      truToast('The image could not be uploaded successfully');
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const avatarJsx = (
      <div style={ { display: 'flex', alignItems: 'center' } }>
        <Avatar
          uri={ avatarURL }
          size={ isLargerThanTablet() ? 144 : 96 }
        />
        <EditImage
          onUpload={ onImageUpload  }
          color={ Color.APP_PURPLE }
          size={ IconSize.XSMALL }
          title={ 'Change Profile Picture' }
        />
      </div>
    );

  const setFullNameText = (e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value);
  const setUsernameText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.value === account.userProfile.username) {
      setUsernameValidated(true);
      setUsername(value);
      return;
    }

    debouncedCheckUsername(value, (data?: UsernameValidationResult) => {
      if (data && ValidationUtil.validateUsername(value)) {
        setUsernameValidated( data.is_unique );
      } else {
        setUsernameValidated(false);
      }
    });
    setUsername(value);
  };

  const setBioText = (e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value);

  let disabled = false;
  if (!usernameValidated) {
    disabled = true;
  } else {
    disabled = !((fullName !== '' && fullName !== account.userProfile.fullName) ||
    (avatarURL !== account.userProfile.avatarURL) ||
    (bio !== account.userProfile.bio) ||
    (username !== account.userProfile.username));
  }

  return (
    <View style={ [ styles.container, style ] }>
      <div style={ { display: 'flex', flexDirection: 'row', alignItems: 'center' } }>
        <BaseIconView name={ 'arrow-left' } color={ Color.APP_PURPLE } size={ 12 } />
        <BaseATag
          appLink={ `${Routes.PROFILE}${account.id}` }
          color={ Color.APP_PURPLE }
          style={ { marginLeft: Whitespace.TINY } }
          textSize={ TextSize.H6 }
        >
          Back to Profile
        </BaseATag>
      </div>
      <BaseText
        textSize={ TextSize.H2 }
        bold={ true }
        color={ Color.APP_BLACK }
        style={ { marginBottom: Whitespace.LARGE } }
      >
        Edit Profile
      </BaseText>
      { avatarJsx }
      <div style={ { display: 'flex', alignItems: 'center', marginTop: Whitespace.LARGE, marginLeft: Whitespace.SMALL } }>
        <BaseText bold={ true } textSize={ TextSize.H5 } style={ { flex: 1 } }>Name</BaseText>
        <CharacterCount
          text={ fullName }
          textSize={ TextSize.H6 }
          minSize={ 0 }
          maxSize={ 28 }
          style={ { justifyContent: 'flex-end' } }
        />
      </div>
      <BaseTextInput
        placeholder={ 'Your full name' }
        value={ fullName }
        onChange={ setFullNameText }
        style={ styles.input }
      />
      <div style={ { display: 'flex', alignItems: 'center', marginTop: Whitespace.LARGE, marginLeft: Whitespace.SMALL } }>
        <BaseText bold={ true } textSize={ TextSize.H5 } style={ { flex: 1 } }>Username</BaseText>
        <CharacterCount
          text={ username }
          textSize={ TextSize.H6 }
          minSize={ 1 }
          maxSize={ 28 }
          style={ { justifyContent: 'flex-end' } }
        />
      </div>
      <div style={ { position: 'relative' } }>
        <BaseTextInput
          placeholder={ 'Your username' }
          value={ username }
          onChange={ setUsernameText }
          style={ styles.input }
        />
        <BaseIconView
          name={ usernameValidated ? 'check' : 'x' }
          color={ usernameValidated ? Color.GREEN : Color.RED  }
          style={ { position: 'absolute', right: 10, top: Whitespace.LARGE, display: username === '' ? 'none' : 'flex' } }
        />
      </div>
      <div style={ { display: 'flex', alignItems: 'center', marginTop: Whitespace.LARGE, marginLeft: Whitespace.SMALL } }>
        <BaseText bold={ true } textSize={ TextSize.H5 } style={ { flex: 1 } }>Bio</BaseText>
        <CharacterCount
          text={ bio }
          textSize={ TextSize.H6 }
          minSize={ 0 }
          maxSize={ 160 }
          style={ { justifyContent: 'flex-end' } }
        />
      </div>
      <BaseTextArea
        placeholder={ 'Your bio' }
        value={ bio }
        onChange={ setBioText }
        style={ { ...styles.input, paddingTop: 14, paddingBottom: 14 } }
      />
      <div style={ { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } }>
        <BaseButton
          title={ 'Save Changes' }
          outline={ false }
          onAction={ onSubmit }
          color={ Color.WHITE }
          accentColor={ Color.APP_PURPLE }
          disabled={ disabled }
        />
      </div>
      <div style={ styles.listContainer }>
        <CommunitiesDetailedList />
      </div>
    </View>
  );
};

const styles = {
  container: { },
  input: {
    border: `1px solid ${Color.LINE_GRAY}`,
    paddingTop: Whitespace.SMALL + 13,
    paddingBottom: Whitespace.SMALL + 13,
    paddingLeft: Whitespace.SMALL,
    marginTop: Whitespace.TINY,
    borderRadius: Whitespace.TINY,
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    marginRight: -Whitespace.TINY,
    marginLeft: -Whitespace.TINY,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(EditAccountScreen);
