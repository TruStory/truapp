import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import CharacterCount from 'shared/components/CharacterCount';
import SwitchSelector from 'shared/components/Selector/SwitchSelector';
import { TextAlign, TextSize } from 'shared/styles';
import { AccentColor } from 'shared/styles/colors';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import BaseTextInput from 'web/src/components/Base/BaseTextInput';
import MarkdownControls from 'web/src/components/Markdown/MarkdownControls';
import MarkdownInput from 'web/src/components/Markdown/MarkdownInput';

interface Props {
  settings: Settings;
  vote: boolean;
  summaryText: string;
  argumentText: string;
  onUpdateSummary: (text: string) => void;
  onUpdateArgument: (text: string) => void;
  onUpdateVote: (vote: boolean) => void;
  style?: React.CSSProperties;
}

const AddClaimArgument = (props: Props) => {

  const { settings, onUpdateSummary, onUpdateArgument, vote, onUpdateVote, argumentText, summaryText, style } = props;
  const [ textAreaRef ] = React.useState(React.createRef<HTMLTextAreaElement>());
  const [ markdownRef, setMarkdownRef ] = React.useState(React.createRef<MarkdownInput>());
  const [ showPreview, setShowPreview ] = React.useState(false);
  const { argumentBodyMaxLength, argumentBodyMinLength, argumentSummaryMaxLength, argumentSummaryMinLength } = settings;

  const updateText = (text: string) => { onUpdateArgument(text); };
  const updateSummary = (e: ChangeEvent<HTMLInputElement>) => { onUpdateSummary(e.target.value); };
  const noEvent = () => { };

  const updateVote = (text: string) => onUpdateVote( text === 'Back' );
  const onPreviewToggledAction = () => setShowPreview(!showPreview);
  const onMarkdownModified = (markdown: string) => updateText(markdown);
  const onMarkdownGenerated = (markdown: string) => {
    if (textAreaRef.current && markdownRef.current) {
      markdownRef.current.insertText(textAreaRef.current, markdown);
    }
  };

  return (
    <div style={ { ...styles.container, ...style } }>
      <div style={ { ...styles.sectionContainer, display: 'flex', marginBottom: Whitespace.TINY } }>
        <div style={ { display: 'flex', flex: 1 } }>
          <SwitchSelector
            accentColor={ vote ? AccentColor.BACK : AccentColor.CHALLENGE }
            leftText={ 'Back' }
            rightText={ 'Challenge' }
            selected={ vote ? 'Back' : 'Challenge' }
            onPress={ updateVote }
            style={ { width: 200, justifyContent: 'flex-start' } }
          />
        </div>
        <div style={ { display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' } }>
          <MarkdownControls
            textAreaRef={ textAreaRef }
            onMarkdownGenerated={ onMarkdownGenerated }
            onMarkdownModified={ onMarkdownModified }
            showPreview={ showPreview }
            onPreviewToggled={ onPreviewToggledAction }
            style={ styles.markdownControlContainer }
          />
          <CharacterCount
            text={ argumentText }
            textSize={ TextSize.H6 }
            minSize={ argumentBodyMinLength }
            maxSize={ argumentBodyMaxLength }
            align={ TextAlign.RIGHT }
            includeAddressLength={ true }
            />
        </div>
      </div>
      <div style={ { ...styles.sectionContainer } }>
        <MarkdownInput
          ref={ (ref: any) => setMarkdownRef(ref) }
          textAreaRef={ textAreaRef }
          showPreview={ showPreview }
          placeholder={ `What's your argument?` }
          value={ argumentText }
          onChange={ updateText }
          onFocus={ noEvent }
          onBlur={ noEvent }
          height={ 300 }
          autoFocus={ isLargerThanTablet() }
        />
      </div>
      <div style={ { ...styles.sectionContainer } }>
        <BaseLine style={ { marginBottom: Whitespace.SMALL } } />
        <div style={ { display: 'flex', alignItems: 'center' } }>
          <BaseText style={ { flex: 1 } }>TLDR</BaseText>
          <CharacterCount
            text={ summaryText }
            textSize={ TextSize.H6 }
            minSize={ argumentSummaryMinLength }
            maxSize={ argumentSummaryMaxLength }
          />
        </div>
        <BaseTextInput
          placeholder={ 'Summarize your argument in 140 characters or less' }
          value={ summaryText }
          onChange={ updateSummary }
        />
      </div>
    </div>
  );
};

const styles = {
  container: { },
  markdownControlContainer: {
    justifyContent: 'space-between',
    width: 250,
  },
  sectionContainer: {
    borderRadius: Whitespace.TINY,
    marginBottom: Whitespace.SMALL,
  },
};

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(AddClaimArgument);
