import * as React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Account } from 'shared/blockchain/account';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseLine from 'shared/components/Base/BaseLine';
import CharacterCount from 'shared/components/CharacterCount';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import { toastOptions } from 'shared/utils/toast';
import ValidationUtil from 'shared/utils/validation';
import MarkdownControls from 'web/src/components/Markdown/MarkdownControls';
import MarkdownInput from 'web/src/components/Markdown/MarkdownInput';
import SignInButton from '../Login/SignInButton';

interface Props {
  account?: Account;
  settings: Settings;
  disabled: boolean;
  postComment: (text: string) => void;
  onChange?: (text: string) => void;
  height: number;
  value: string;
  style?: React.CSSProperties;
}

const CommentsInputComponent = (props: Props) => {

  const { account, settings, postComment, onChange, height, value, style } = props;
  const [ text, setText ] = React.useState(value || '');
  const markdownRef = React.useRef<MarkdownInput>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const [ showPreview, setShowPreview ] = React.useState(false);
  const [ sendingComment, setSendingComment ] = React.useState(false);
  const { maxCommentLength, minCommentLength } = settings;

  // re-render component if value prop updates
  React.useEffect(() => {
    setText(value);
  }, [value]);

  const updateText = (text: string) => { setText(text); onChange && onChange(text); };
  const noEvent = () => { };
  const onPress = async () => {
    try {
      setSendingComment(true);
      const validated = ValidationUtil.errors({
        summaryText: [
          ValidationUtil.err(ValidationUtil.minLength(text, settings.minCommentLength),
            `Your comment must be at least ${settings.minCommentLength} characters long`),
          ValidationUtil.err(ValidationUtil.maxLength(text, settings.maxCommentLength),
            `Your comment must be less than ${settings.maxCommentLength} characters long`),
        ],
      });

      if (validated.length === 0) {
        await postComment( text );
        setSendingComment(false);
        setText('');
      } else {
        toast.error(validated[0], toastOptions);
        setSendingComment(false);
        return;
      }
    } catch (err) {
      setSendingComment(false);
    }
  };

  if (!account) {
    return (
      <div style={ { display: 'flex', alignContent: 'center', justifyContent: 'center', paddingTop: 17.5, paddingBottom: Whitespace.LARGE + 1 } }>
        <SignInButton />
      </div>
    );
  }

  const onPreviewToggledAction = () => setShowPreview(!showPreview);
  const onMarkdownModified = (markdown: string) => updateText(markdown);
  const onMarkdownGenerated = (markdown: string) => {
    if (textAreaRef.current && markdownRef.current) {
      markdownRef.current.insertText(textAreaRef.current, markdown);
    }
  };

  return (
    <div style={ { ...styles.container, ...style } }>
      <MarkdownControls
        textAreaRef={ textAreaRef }
        onMarkdownGenerated={ onMarkdownGenerated }
        onMarkdownModified={ onMarkdownModified }
        showPreview={ showPreview }
        onPreviewToggled={ onPreviewToggledAction }
        style={ styles.markdownControlContainer }
      />
      <BaseLine style={ { marginTop: Whitespace.SMALL, marginBottom: Whitespace.MEDIUM } } />
      <div style={ styles.buttonContainer }>
        <AppAccountAvatar appAccount={ account } style={ { justifyContent: 'flex-start', flex: 1 } } />
        <CharacterCount
          text={ text }
          textSize={ TextSize.H6 }
          minSize={ minCommentLength }
          maxSize={ maxCommentLength }
          style={ { marginRight: Whitespace.SMALL } }
          includeAddressLength={ true }
          />
        <BaseButton
          title={ 'Send' }
          onAction={ onPress }
          height={ 27 }
          width={ 64 }
          color={ Color.APP_PURPLE }
          accentColor={ Color.APP_PURPLE }
          disabled={ sendingComment }
          textSize={ TextSize.H5 }
        />
      </div>
      <MarkdownInput
        ref={ markdownRef }
        textAreaRef={ textAreaRef }
        showPreview={ showPreview }
        placeholder={ `Join the conversation...` }
        value={ text }
        onChange={ updateText }
        onFocus={ noEvent }
        onBlur={ noEvent }
        height={ height }
        autoFocus={ false }
        style={ { marginLeft: Whitespace.SMALL, marginRight: Whitespace.SMALL, marginTop: Whitespace.TINY, paddingBottom: Whitespace.LARGE } }
      />
    </div>
  );
};

CommentsInputComponent.defaultProps = {
  height: 200,
};

const styles = {
  container: { },
  markdownControlContainer: {
    justifyContent: 'space-between',
    marginRight: Whitespace.SMALL,
    marginLeft: Whitespace.SMALL,
    marginTop: Whitespace.SMALL,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: Whitespace.SMALL,
    marginLeft: Whitespace.SMALL,
    marginBottom: Whitespace.SMALL,
  },
  signInContainer: {
    paddingTop: Whitespace.LARGE,
    borderTop: `1px solid ${Color.LINE_GRAY}`,
    flex: 0,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(CommentsInputComponent);
