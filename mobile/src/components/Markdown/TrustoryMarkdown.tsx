import { fixLinks } from 'mobile/src/components/Markdown/MarkdownIt';
import { handleOpenURL } from 'mobile/src/utils/notifications';
import * as React from 'react';
import { Linking, StyleProp, StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import FitImage from 'react-native-fit-image';
import Markdown, { RenderRules } from 'react-native-markdown-renderer';
import { Color } from 'shared/styles/colors';
import { FontFamily, MobileFontSize, MobileLineHeight } from 'shared/styles/fonts';
import { Whitespace } from 'shared/styles/views';

interface Props {
  children: any;
  plugins?: any[];
  renderers?: { [nodeType: string]: React.ReactType};
  rules?: RenderRules;
  fontFamily?: string;
  style?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
}

const renderImage = (node: any, children: any, parent: any, styles: any) => {
  return (
    <FitImage
      indicator={ true }
      key={ node.key }
      style={ styles.image }
      source={ { uri: node.attributes.src } }
    />
  );
};

export default class TrustoryMarkdown extends React.Component<Props> {

  shouldComponentUpdate(nextProps: Props) {
    return !(nextProps.children === this.props.children);
  }

  render() {
    const { children, rules, style, fontFamily } = this.props;

    const OverrideOnPressRule = (callback: any) => ({
      link: (node: any, children: any, parent: any, styles: any) => {
        return (
          <Text key={ node.key } style={ styles.link } onPress={ () => callback(node.attributes.href) }>
            { children }
          </Text>
        );
      },
      // a with a non text element nested inside
      blocklink: (node: any, children: any, parent: any, styles: any) => {
        return (
          <TouchableWithoutFeedback key={ node.key } onPress={ () => callback(node.attributes.href) } style={ styles.blocklink }>
            <View style={ styles.image }>{ children }</View>
          </TouchableWithoutFeedback>
        );
      },
    });

    return (
      <View style={ [styles.container, style ] }>
        <Markdown
          markdownit={ fixLinks }
          // tslint:disable-next-line: jsx-no-multiline-js
          style={ {
            image : { width: '100%' },
            heading1: {
              fontSize: MobileFontSize.H1,
              lineHeight: MobileLineHeight.H1,
              fontWeight: 'bold',
            },
            blockquote: {
              backgroundColor: Color.BACKGROUND,
              paddingLeft: Whitespace.LARGE * 2,
              paddingRight: Whitespace.SMALL,
              fontStyle: 'italic',
              color: Color.DARK_GRAY,
            },
            link: {
              color: Color.APP_PURPLE,
            },
            mailTo: {
              color: Color.APP_PURPLE,
            },
            plainText: {
              color: Color.APP_BLACK,
              fontFamily: fontFamily ? fontFamily : FontFamily.serif,
              fontSize: MobileFontSize.H4,
              lineHeight : MobileLineHeight.H4,
            },
            text: {
              color: Color.APP_BLACK,
              fontFamily: fontFamily ? fontFamily : FontFamily.serif,
              fontSize: MobileFontSize.H4,
              lineHeight: MobileLineHeight.H4,
            } } }
          // tslint:disable: jsx-no-multiline-js
          rules={ Object.assign({ }, rules, { image: renderImage }, OverrideOnPressRule((url: string) => {
            console.log(url);
            if (url.includes('.trustory.io')) {
              handleOpenURL({ url });
            } else {
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                }
              });
            }
          })) }
        >
          { children }
        </Markdown>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
