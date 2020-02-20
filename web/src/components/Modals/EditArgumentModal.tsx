import React, { ChangeEvent } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import CharacterCount from 'shared/components/CharacterCount';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import ValidationUtil from 'shared/utils/validation';
import MarkdownControls from 'web/src/components/Markdown/MarkdownControls';
import MarkdownInput from 'web/src/components/Markdown/MarkdownInput';
import BaseTextArea from '../Base/BaseTextArea';

interface Props {
  account: Account;
  settings: Settings;
  argumentId: ID;
  incomingArgumentText: string;
  incomingArgumentSummary: string;
  incomingArgumentVote: boolean;
  onSubmit: (argumentId: ID, argumentBody: string, argumentSummary: string) => void;
  onClose: () => void;
}

const EditConfirmationModal = (props: Props) => {

  const { onClose, incomingArgumentText, incomingArgumentSummary, settings, onSubmit, argumentId } = props;
  let contentJsx: React.ReactNode | React.ReactNode[];

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const markdownRef = React.useRef<MarkdownInput>(null);
  const [showPreview, setShowPreview] = React.useState(false);

  const [ argumentText, setArgumentText ] = React.useState(incomingArgumentText);
  const [ summaryText, setSummaryText ] = React.useState(incomingArgumentSummary);
  const { argumentBodyMaxLength, argumentBodyMinLength, argumentSummaryMaxLength, argumentSummaryMinLength } = settings;

  const updateText = (text: string) => setArgumentText(text);
  const updateSummaryText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSummaryText(e.target.value);
  };

  const onPreviewToggledAction = () => setShowPreview(!showPreview);
  const onMarkdownModified = (markdown: string) => updateText(markdown);
  const onMarkdownGenerated = (markdown: string) => {
    if (textAreaRef.current && markdownRef.current) {
      markdownRef.current.insertText(textAreaRef.current, markdown);
    }
  };

  const validate = (): string[] => {
    return ValidationUtil.errors({
      argument: [
        ValidationUtil.err(ValidationUtil.minLength(argumentText, argumentBodyMinLength),
          `Argument must be at least ${argumentBodyMinLength} characters`),
        ValidationUtil.err(ValidationUtil.maxLength(argumentText, argumentBodyMaxLength),
          `Argument must be less than ${argumentBodyMaxLength} characters`),
      ],
      summaryText: [
        ValidationUtil.err(ValidationUtil.minLength(summaryText, argumentSummaryMinLength),
          `The argument summary must be at least ${argumentSummaryMinLength} characters`),
        ValidationUtil.err(ValidationUtil.maxLength(summaryText, argumentSummaryMaxLength),
          `The argument summary must be less than ${argumentSummaryMaxLength} characters`),
      ],
    });
  };

  const disabled = validate().length !== 0;

  const noEvent = () => { };
  const onSubmitAction = () => onSubmit(argumentId, argumentText, summaryText);

// tslint:disable: max-line-length
  contentJsx = (
      <React.Fragment>
        <div style={ { ...styles.sectionContainer, flexWrap: 'wrap', display: 'flex', justifyContent: 'center' } } className={ 'add-argument-controls' }>
          <MarkdownControls
            textAreaRef={ textAreaRef }
            onMarkdownGenerated={ onMarkdownGenerated }
            onMarkdownModified={ onMarkdownModified }
            showPreview={ showPreview }
            onPreviewToggled={ onPreviewToggledAction }
            style={ styles.markdownControlContainer }
          />
        </div>
        <div style={ { ...styles.sectionContainer } }>
          <div style={ { display: 'flex', alignItems: 'center' } }>
            <CharacterCount
              text={ argumentText }
              textSize={ TextSize.H6 }
              minSize={ argumentBodyMinLength }
              maxSize={ argumentBodyMaxLength }
              includeAddressLength={ true }
            />
          </div>
          <MarkdownInput
            ref={ markdownRef }
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
          <div style={ { display: 'flex', alignItems: 'center' } }>
            <BaseText style={ { flex: 1 } }>TLDR</BaseText>
            <CharacterCount
              text={ summaryText }
              textSize={ TextSize.H6 }
              minSize={ argumentSummaryMinLength }
              maxSize={ argumentSummaryMaxLength }
            />
          </div>
          <BaseTextArea
            placeholder={ 'Summarize your argument in 140 characters or less' }
            value={ summaryText }
            onChange={ updateSummaryText }
            style={ { height: 60 } }
          />
        </div>
        <div style={ { display: 'flex', justifyContent: 'center', marginTop: Whitespace.SMALL } }>
          <BaseButton
            title={ 'Update' }
            outline={ false }
            accentColor={ Color.APP_PURPLE }
            color={ Color.WHITE }
            onAction={ onSubmitAction }
            disabled={ disabled }
          />
        </div>
      </React.Fragment>
    );

  return (
  <View>
    <View style={ { flexDirection: 'row', alignItems: 'center', flex: 1, marginBottom: Whitespace.LARGE } }>
      <View style={ { flexDirection: 'row', flex: 1, justifyContent: 'center' } }>
        <BaseText
          color={ Color.APP_BLACK }
          textSize={ TextSize.H2 }
          bold={ true }
          style={ { marginRight: -Whitespace.LARGE } }
        >
          Edit Argument
        </BaseText>
      </View>
      <BaseActionable onAction={ onClose } style={ { alignItems: 'flex-end' } }>
        <BaseIconView family={ 'Feather' } name={ 'x' } />
      </BaseActionable>
    </View>
    { contentJsx }
  </View>
  );
};

const styles = {
  markdownControlContainer: {
    justifyContent: 'space-between',
    width: 275,
  },
  sectionContainer: {
    border: `1px solid ${Color.LINE_GRAY}`,
    padding: Whitespace.MEDIUM,
    borderRadius: Whitespace.TINY,
    marginBottom: Whitespace.SMALL,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(EditConfirmationModal);
