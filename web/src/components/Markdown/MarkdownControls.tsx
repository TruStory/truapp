import React from 'react';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { Color } from 'shared/styles/colors';
import { IconSize } from 'shared/styles/views';
import AddImage from 'web/src/components/Markdown/AddImage';
import MarkdownTypographyModifier from 'web/src/components/Markdown/MarkdownTypographyModifier';
import AddLink from './AddLink';

interface Props {
  onMarkdownModified: (text: string) => void;
  onMarkdownGenerated: (text: string) => void;
  onPreviewToggled: () => void;
  showPreview: boolean;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  style?: React.CSSProperties;
}

const MarkdownControls = (props: Props) => {
  const { onMarkdownModified, onMarkdownGenerated, textAreaRef, style, onPreviewToggled, showPreview } = props;
  const previewTip = ( showPreview ? { title: 'Editor', subtitle: 'Go back to editing your text' } :
    { title: 'Preview', subtitle: 'See a preview of your text the way it will be shown' } );
  const addLinkTip = { title: 'Add Link', subtitle: 'Add a link with an optional description' };

  const onClickAddLink = () => {
    const onClose = () => AlertModalHandler.close();
    AlertModalHandler.basic(<AddLink onSubmit={ onMarkdownGenerated } onClose={ onClose } inputRef={ textAreaRef } />);
  };

  return (
      <div style={ { ...styles.container, ...style } }>
        <BaseActionable
          onAction={ onPreviewToggled }
          tip={ previewTip }
          style={ styles.actionItem }
        >
          <BaseIconView name={ showPreview ? 'edit' : 'eye' } color={ Color.GRAY } size={ IconSize.XSMALL } />
        </BaseActionable>
        <MarkdownTypographyModifier
          modifier={ '**' }
          onMarkdownModified={ onMarkdownModified }
          inputRef={ textAreaRef }
          icon={ 'format-bold' }
          color={ Color.GRAY }
          style={ { ...styles.actionItem, marginTop: 4 } }
          tip={ { title: 'Bold', subtitle: 'Bolds the selected text using Markdown' } }
        />
        <MarkdownTypographyModifier
          modifier={ '*' }
          onMarkdownModified={ onMarkdownModified }
          icon={ 'format-italic' }
          inputRef={ textAreaRef }
          color={ Color.GRAY }
          style={ { ...styles.actionItem, marginTop:  4 } }
          tip={ { title: 'Italics', subtitle: 'Italicized the selected text using Markdown' } }
        />
        <MarkdownTypographyModifier
          modifier={ '__' }
          onMarkdownModified={ onMarkdownModified }
          icon={ 'format-underlined' }
          inputRef={ textAreaRef }
          color={ Color.GRAY }
          style={ { ...styles.actionItem, marginTop: 4 } }
          tip={ { title: 'Underline', subtitle: 'Underline the selected text using Markdown' } }
        />
        <MarkdownTypographyModifier
          modifier={ '\n1. ' }
          onMarkdownModified={ onMarkdownModified }
          icon={ 'format-list-numbered' }
          wrap={ false }
          inputRef={ textAreaRef }
          color={ Color.GRAY }
          style={ { ...styles.actionItem, marginTop: 3 } }
          tip={ { title: 'Numbered List', subtitle: 'Start a numbered list' } }
        />
        <MarkdownTypographyModifier
          modifier={ '\n- ' }
          onMarkdownModified={ onMarkdownModified }
          icon={ 'format-list-bulleted' }
          wrap={ false }
          inputRef={ textAreaRef }
          color={ Color.GRAY }
          style={ { ...styles.actionItem, marginTop: 3 } }
          tip={ { title: 'Bulleted List', subtitle: 'Start a bulleted list' } }
        />
        <AddImage
          onUpload={ onMarkdownGenerated }
          style={ { ...styles.actionItem } }
          color={ Color.GRAY }
          size={ IconSize.XSMALL }
        />
        <div style={ styles.actionItem }>
          <BaseActionable
            onAction={ onClickAddLink }
            tip={ addLinkTip }
            style={ { ... styles.actionItem, marginTop: -3, display: 'flex' } }
          >
            <BaseIconView name={ 'link' } color={ Color.GRAY } size={ IconSize.XSMALL } />
          </BaseActionable>
        </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  actionItem: {
    cursor: 'pointer',
  },
};

export default MarkdownControls;
