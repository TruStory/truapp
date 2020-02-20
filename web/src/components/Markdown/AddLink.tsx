import * as React from 'react';
import { toast } from 'react-toastify';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { toastOptions } from 'shared/utils/toast';
import ValidationUtil from 'shared/utils/validation';
import BaseTextInput from 'web/src/components/Base/BaseTextInput';

interface Props {
  style?: React.CSSProperties;
  onClose: () => void;
  onSubmit: (markdown: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const AddLink = (props: Props) => {
  const { style, onClose, onSubmit, inputRef } = props;
  const [ linkText, setLinkText ] = React.useState('');

  const prefillDescriptionText = () => {
    if (inputRef.current) {
      const cursorStart = inputRef.current.selectionStart;
      const cursorEnd = inputRef.current.selectionEnd;
      const allText = inputRef.current.value;
      const selectedText = allText.substring(cursorStart, cursorEnd);

      if (selectedText !== '') {
        return selectedText;
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  const [ descriptionText, setDescriptionText ] = React.useState(prefillDescriptionText());

  const onSubmitAction = () => {
    if (!ValidationUtil.validateUrl(ValidationUtil.prefixUrl(linkText))) {
      toast.error('Please enter a valid url', toastOptions);
      return;
    }

    AlertModalHandler.close();
    const markdown = `[${descriptionText || linkText}](${ValidationUtil.prefixUrl(linkText)})`;
    onSubmit(markdown);
  };

  const setLinkInputText = (event: React.ChangeEvent<HTMLInputElement>) => setLinkText(event.target.value);
  const setDescriptionInputText = (event: React.ChangeEvent<HTMLInputElement>) => setDescriptionText(event.target.value);

  return (
    <div style={ { ...styles.container, ...style } }>
      <div style={ { display: 'flex', alignItems: 'center', flex: 1 } }>
        <div style={ { display: 'flex', flex: 1 } }>
          <BaseIconView name={ 'link' } color={ Color.APP_BLACK } />
          <BaseText color={ Color.APP_BLACK } bold={ true } style={ { marginLeft: Whitespace.SMALL } }>Add Link</BaseText>
        </div>
        <BaseActionable onAction={ onClose }>
          <BaseIconView family={ 'Feather' } name={ 'x' } />
        </BaseActionable>
      </div>
      <BaseTextInput
        placeholder={ 'Paste link here' }
        value={ linkText }
        onChange={ setLinkInputText }
        style={ { ...styles.input, marginTop: Whitespace.SMALL } }
      />
      <BaseTextInput
        placeholder={ 'Describe link (optional)' }
        value={ descriptionText }
        onChange={ setDescriptionInputText }
        style={ { ...styles.input, marginBottom: Whitespace.MEDIUM, marginTop: Whitespace.TINY + (Whitespace.TINY / 2) } }
      />
      <BaseButton
        onAction={ onSubmitAction }
        title={ 'Add' }
        width={ '100%' }
        color={ Color.WHITE }
        accentColor={ Color.APP_PURPLE }
        outline={ false }
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    width: 300,
    flexDirection: 'column' as 'column',
  },
  input: {
    borderBottom: `1px solid ${Color.LINE_GRAY}`,
    paddingBottom: Whitespace.SMALL,
    marginTop: Whitespace.TINY,
  },
};

export default AddLink;
