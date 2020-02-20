import AddImageComponent from 'mobile/src/components/AddImageComponent';
import AddLinkComponent from 'mobile/src/components/AddLinkComponent';
import MarkdownTypographyModifier from 'mobile/src/components/Markdown/MarkdownTypographyModifier';
import { Routes } from 'mobile/src/navigation/Routes';
import React from 'react';
import { Dimensions, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import MentionsTextInput from 'react-native-mentions';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import AppConfig from 'shared/app-config.json';
import Avatar from 'shared/components/AppAccount/Avatar';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import { Color } from 'shared/styles/colors';
import { MobileFontSize } from 'shared/styles/fonts';
import { IconSize, Whitespace } from 'shared/styles/views';

interface Props extends NavigationScreenProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  value: string;
  allowMentions: boolean;
  color: Color;
  onChange: (markdownText: string) => void;
  placeholder: string;
  autoFocus: boolean;
  barPosition?: 'top' | 'bottom';
  submitButton?: BaseButton;
}

export interface Selection {
  start: number;
  end: number;
  selectedText: string;
  allText: string;
}

const MarkdownInput = (props: Props) => {

  const { style, value, onChange, placeholder, autoFocus, inputStyle, barPosition, submitButton, navigation, allowMentions } = props;
  const [ currentSelection, setCurrentSelection ] = React.useState<Selection>({ start: 0, end: 0, selectedText: '', allText: '' });
  const [ mentionsData, setMentionsData ] = React.useState([]);
  const [ keyword, setKeyword ] = React.useState('');

  const onPreviewTapped = () => navigation.navigate(Routes.Preview, { text: value });

  const onChangeText = (text: string) => {
    setCurrentSelection({
      start: currentSelection.start,
      end: currentSelection.end,
      selectedText: text.substring(currentSelection.start, currentSelection.end),
      allText: text,
    });
    onChange(text);
  };
  const onMarkdownModifiedAction = (text: string) => onChangeText(text);
  const onImageGeneratedAction = (text: string) => {
    const link = `![Image](${text})`;
    let str1 = currentSelection.allText.substr(0, currentSelection.start);
    let str2 = currentSelection.allText.substr(currentSelection.end, currentSelection.allText.length - 1);
    onChangeText(`${str1}${link}${str2}`);
  };
  const onLinkGeneratedAction = (text: string) => {
    let str1 = currentSelection.allText.substr(0, currentSelection.start);
    let str2 = currentSelection.allText.substr(currentSelection.end, currentSelection.allText.length - 1);
    onChangeText(`${str1}${text}${str2}`);
  };
  const onSelectionChange = (event: any) => {
    setCurrentSelection({
      start: event.nativeEvent.selection.start,
      end: event.nativeEvent.selection.end,
      selectedText: value.substring(event.nativeEvent.selection.start, event.nativeEvent.selection.end),
      allText: value,
    });
  };

  const renderDisplay = () => {
    let inputJsx;

    const getMentions =  (search: string, callback: any) => {
      setKeyword(search);
      fetch(`${AppConfig.chain_url }${AppConfig.api.endpoint}/user/search?username_prefix=${search.replace('@', '')}`, { headers: { 'Content-Type' : 'application/json' } })
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
            return [ { id: '-1', display: 'No results found.' } ];
          }
        } else {
          return [ { id: '-1', display: 'No results found.' } ];
        }
      })
      .then((data) => setMentionsData(data))
      .catch(() => callback);
    };

    const renderSuggestionRow = (item: { item: { id: string, display: string, image: string } }, hidePanel: () => void) => {
      const onSelectRow = () => {
        hidePanel();

        if (item.item.id === '-1')
          return;

        const replacedText = value.slice(0, - keyword.length);
        onChange(`${replacedText}@${item.item.display}`);
      };

      return (
        <BaseActionable
          onAction={ onSelectRow }
          style={ { flex: 1, height: 44, paddingVertical: Whitespace.TINY, paddingHorizontal: Whitespace.CONTAINER, alignItems: 'center', flexDirection: 'row' } }
        >
          { item.item.image && <Avatar size={ 25 } uri={ item.item.image } style={ { } } /> }
          <BaseText color={ Color.APP_BLACK }>{ item.item.display }</BaseText>
        </BaseActionable>
      );
    };

    if (allowMentions) {
      inputJsx = (
        <MentionsTextInput
          textInputStyle={ { ...styles.mentionsInput } }
          suggestionsPanelStyle={ { width: '100%', borderRadius: Whitespace.MEDIUM, marginBottom: Whitespace.TINY } }
          loadingComponent={ () => <BaseLoadingIndicator size={ 'small' } /> }
          textInputMinHeight={ 38 }
          textInputMaxHeight={ 140 }
          placeholder={ placeholder }
          onSelectionChange={ onSelectionChange }
          trigger={ '@' }
          triggerLocation={ 'anywhere' }
          value={ value }
          onChangeText={ onChangeText }
          triggerCallback={ getMentions }
          renderSuggestionsRow={ renderSuggestionRow }
          suggestionsData={ mentionsData }
          keyExtractor={ () => Math.random() }
          suggestionRowHeight={ 44 }
          horizontal={ false }
          MaxVisibleRowCount={ 3 }
        />
      );
    } else {
      inputJsx = (
        <TextInput
          multiline={ true }
          style={ [ styles.input, inputStyle ] }
          onChangeText={ onChangeText }
          value={ value }
          onSelectionChange={ onSelectionChange }
          placeholder={ placeholder }
          autoFocus={ autoFocus }
        />
      );
    }

    if (submitButton) {
      return (
        <View style={ { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Whitespace.SMALL } }>
          { inputJsx }
          { submitButton }
        </View>
      );
    }

    return inputJsx;
  };

  const controlsJsx = (
    <View style={ styles.controls }>
      <BaseActionable
        onAction={ onPreviewTapped }
        style={ styles.modifier }
      >
        <BaseIconView name={ 'eye' } color={ Color.APP_BLACK } size={ IconSize.XSMALL } />
      </BaseActionable>
      <MarkdownTypographyModifier
        modifier={ '**' }
        selection={ currentSelection }
        wrap={ true }
        icon={ 'format-bold' }
        onMarkdownModified={ onMarkdownModifiedAction }
        style={ styles.modifier }
      />
      <MarkdownTypographyModifier
        modifier={ '*' }
        selection={ currentSelection }
        wrap={ true }
        icon={ 'format-italic' }
        onMarkdownModified={ onMarkdownModifiedAction }
        style={ styles.modifier }
      />
      <MarkdownTypographyModifier
        modifier={ '\n1. ' }
        selection={ currentSelection }
        wrap={ false }
        icon={ 'format-list-numbered' }
        onMarkdownModified={ onMarkdownModifiedAction }
        style={ styles.modifier }
      />
      <MarkdownTypographyModifier
        modifier={ '\n- ' }
        selection={ currentSelection }
        wrap={ false }
        icon={ 'format-list-bulleted' }
        onMarkdownModified={ onMarkdownModifiedAction }
        style={ styles.modifier }
      />
      <AddLinkComponent
        selection={ currentSelection }
        onLinkGenerated={ onLinkGeneratedAction }
        style={ styles.modifier }
      />
      <AddImageComponent
        onLinkGenerated={ onImageGeneratedAction }
        style={ styles.modifier }
      />
    </View>
  );

  if (barPosition === 'top') {
    return (
      <View style={ [ styles.container, style ] }>
        <BaseLine />
        { controlsJsx }
        { renderDisplay() }
      </View>
    );
  }

  return (
    <View style={ [ styles.container, style ] }>
      { renderDisplay() }
      <BaseLine style={ { marginBottom: Whitespace.TINY } } />
      { controlsJsx }
    </View>
  );
};

MarkdownInput.defaultProps = {
  barPosition: 'bottom',
  allowMentions: false,
};

const styles = StyleSheet.create({
  container: {
  },
  controls: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mentionsInput: {
    width: Dimensions.get('screen').width - 90,
    textAlignVertical: 'center',
    padding: Whitespace.CONTAINER,
    paddingTop: 10,
    borderRadius: Whitespace.MEDIUM,
    borderWidth: 1,
    borderColor: Color.LINE_GRAY,
  },
  input: {
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    padding: 0,
    paddingTop: Whitespace.SMALL,
    paddingBottom: Whitespace.SMALL,
    fontSize: MobileFontSize.H4,
  },
  modifier: {
    padding: Whitespace.SMALL,
  },
});

export default withNavigation(MarkdownInput);
