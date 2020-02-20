import { Selection } from 'mobile/src/components/Markdown/MarkdownInput';
import * as React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleProp, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseCard, { CardOption } from 'shared/components/Base/BaseCard';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { truToastError } from 'shared/components/Toast/TruToast';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { MobileFontSize } from 'shared/styles/fonts';
import { Whitespace } from 'shared/styles/views';
import ValidationUtil from 'shared/utils/validation';

interface Props {
  onLinkGenerated: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode | React.ReactNode[];
  selection: Selection;
}

const AddImageComponent = (props: Props) => {
  const { onLinkGenerated, style, children, selection } = props;
  const [ modalVisible, setModalVisible ] = React.useState(false);
  const [ linkText, setLinkText ] = React.useState('');
  const [ descriptionText, setDescriptionText ] = React.useState(selection.selectedText);

  React.useEffect(() => {
    setDescriptionText(selection.selectedText);
  }, [selection]);

  React.useEffect(() => {
    Keyboard.dismiss();
  }, [modalVisible]);

  const onSubmitAction = () => {
    if (!ValidationUtil.validateUrl(ValidationUtil.prefixUrl(linkText))) {
      truToastError('Please enter a valid url');
      return;
    }

    const markdown = `[${descriptionText || linkText}](${ValidationUtil.prefixUrl(linkText)})`;
    setLinkText('');
    setDescriptionText('');
    setModalVisible(false);
    onLinkGenerated(markdown);
  };

  return (
    <React.Fragment>
      <TouchableOpacity onPress={ () => setModalVisible(true) } style={ [ styles.container, style ] }>
        { children ? children : <BaseIconView name={ 'link' } family={ IconFamily.FEATHER } /> }
      </TouchableOpacity>
      <ActionSheet visible={ modalVisible } onCancel={ () => setModalVisible(false) }>
        <KeyboardAvoidingView
          style={ styles.container }
          behavior={ 'padding' }
          enabled={ Platform.OS === 'ios' }
        >
          <BaseCard radius={ CardOption.TOP } margin={ CardOption.NONE } style={ style }>
            <View style={ { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Whitespace.MEDIUM } }>
              <BaseText textSize={ TextSize.H3 } bold={ true } style={ { flex: 1 } }>Add Link</BaseText>
              <BaseActionable onAction={ () => setModalVisible(false) }>
                <BaseIconView family={ 'Feather' } name={ 'x' } />
              </BaseActionable>
            </View>
            <TextInput
              style={ styles.input }
              autoCapitalize={ 'none' }
              placeholderTextColor={ Color.GRAY }
              onChangeText={ setLinkText }
              value={ linkText }
              placeholder={ `What's the link?` }
              autoFocus={ true }
            />
            <TextInput
              style={ styles.input }
              autoCapitalize={ 'none' }
              placeholderTextColor={ Color.GRAY }
              onChangeText={ setDescriptionText }
              value={ descriptionText }
              placeholder={ `Describe the link (optional)` }
            />
            <BaseButton
              title={ 'Add' }
              width={ '100%' }
              accentColor={ Color.APP_PURPLE }
              color={ Color.WHITE }
              outline={ false }
              style={ { marginTop: Whitespace.SMALL } }
              onAction={ onSubmitAction }
            />
          </BaseCard>
        </KeyboardAvoidingView>
      </ActionSheet>
    </React.Fragment>
  );

};

const styles = StyleSheet.create({
  container: { backgroundColor: Color.WHITE },
  input: {
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    padding: 0,
    paddingVertical: Whitespace.SMALL,
    fontSize: MobileFontSize.H4,
  },
});

export default AddImageComponent;
