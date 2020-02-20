import React, { CSSProperties } from 'react';
import AppConfig from 'shared/app-config.json';
import BaseText from 'shared/components/Base/BaseText';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props {
  style?: CSSProperties;
}

const FooterLinks: React.FunctionComponent<Props> = (props: Props) => {
  const footerLink = (url: string, text: string) => {
    return (
      <div style={ styles.linkCell }>
        <BaseATag
          target={ '_blank' }
          href={ url }
          textSize={ TextSize.H6 }
        >
          { text }
        </BaseATag>
      </div>
    );
  };

  return (
    <div style={ {  ...styles.container, ...props.style } }>
      { footerLink(`${AppConfig.website_url}/about`, 'About') }
      { footerLink(`${AppConfig.website_url}/careers`, 'Careers') }
      { footerLink('mailto:preethi@trustory.io', 'Contact') }
      { footerLink(`${AppConfig.website_url}/privacy`, 'Privacy') }
      { footerLink('https://twitter.com/isTruStory', 'Twitter') }
      { footerLink('https://www.linkedin.com/company/trustory/about/', 'LinkedIn') }
      { footerLink('https://www.youtube.com/channel/UCWOCFO3yzuIFB__E0m3exvg', 'YouTube') }
      { footerLink('https://m.facebook.com/TruStory-431770067611070/)', 'Facebook') }
      <div style={ styles.linkCell }>
        <BaseText
          textSize={ TextSize.H6 }
          color={ Color.APP_BLACK }
        >
          &copy; { new Date().getFullYear() } Trustory
        </BaseText>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
  },
  linkCell: {
    paddingRight: Whitespace.SMALL,
  },
  link: {
    color: Color.DARK_GRAY,
    textDecoration: 'none',
  },
};

export default FooterLinks;
