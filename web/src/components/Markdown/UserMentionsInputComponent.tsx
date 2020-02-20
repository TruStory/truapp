import React from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import AppConfig from 'shared/app-config.json';
import { Color } from 'shared/styles/colors';
import { FontFamily, WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import { Whitespace } from 'shared/styles/views';

interface Props {
  height?: number;
  trigger: string;
  color?: Color;
  value: string;
  placeholder: string;
  onBlur: () => void;
  onFocus: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (event: { target: { value: string } }, newValue: string, newPlainTextValue: string) => void;
  autoFocus: boolean;
}

const UserMentionsInputComponent = (props: Props) => {

  const { value, onChange, onBlur, height, inputRef, trigger, placeholder, onFocus, autoFocus, color } = props;

  const getMentions =  (search: string, callback: any) => {
    fetch(`${AppConfig.api.endpoint}/user/search?username_prefix=${search}`, { headers: { 'Content-Type' : 'application/json' } })
    .then((resp: any) => resp.json())
    .then((data) => {
      if (data.data) {
        if (data.data.usernames && data.data.usernames.length > 0) {
          return data.data.usernames.map((username: string, index: number) => {
            return { id: index.toString(), display: username };
          });
        } else if (data.data.length > 0) {
          return data.data.map((user: { username: string, avatar_url: string }, index: number) => {
            return { id: index.toString(), display: user.username, image: user.avatar_url };
          });
        } else {
          return;
        }
      } else {
        return;
      }
    })
    .then(callback)
    .catch(() => callback);
  };

  const displayTransform = (id: string, display: string) => `@${display}`;
  styles.mentions.input.height = height ? height : 200;
  styles.mentions.input.color = color ? color : Color.APP_BLACK;

  return (
    <MentionsInput
      value={ value }
      onChange={ onChange }
      onFocus={ onFocus }
      onBlur={ onBlur }
      inputRef={ inputRef }
      style={ styles.mentions }
      placeholder={ placeholder }
      autoFocus={ autoFocus }
    >
      <Mention
        trigger={ trigger }
        data={ getMentions }
        style={ { input : { overflow: 'auto' } } }
        displayTransform={ displayTransform }
        appendSpaceOnAdd={ true }
      />
    </MentionsInput>
  );
};

const styles = {
  mentions: {
    input: {
      height: 200,
      border: 'none',
      outline: 'none',
      width: '100%',
      fontFamily: FontFamily.base,
      fontSize: WebFontSize.H4,
      lineHeight: `${WebLineHeight.H4}px`,
      color: Color.DARK_GRAY,
      boxSizing: 'border-box' as 'border-box',
      resize: 'none' as 'none',
      paddingTop: Whitespace.SMALL,
      overflow: 'auto',
    },
    suggestions: {
      list: {
        border: '1px solid rgba(0,0,0,0.15)',
        bottom: 14,
        position: 'absolute',
        overflow: 'auto',
        backgroundColor: 'white',
      },
      item: {
        padding: `${Whitespace.TINY}px ${Whitespace.MEDIUM}px`,
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          color: Color.WHITE,
          backgroundColor: Color.APP_PURPLE,
        },
      },
    },
  },
};

export default UserMentionsInputComponent;
