import React, { ChangeEvent } from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { connect } from 'react-redux';
import { SlideDown } from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import { toast } from 'react-toastify';
import * as AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import { CodeType } from 'shared/blockchain/errors';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import { BaseModalHandler } from 'shared/components/BaseModal/BaseModalHandler';
import CharacterCount from 'shared/components/CharacterCount';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import SwitchSelector from 'shared/components/Selector/SwitchSelector';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import CLAIM_QUERY from 'shared/graphql/queries/claim.query';
import { Language } from 'shared/language';
import { addDraftArgument, addDraftSummary, addDraftVote, removeDraft } from 'shared/redux/actions/argument-draft.action';
import { ArgumentDraft } from 'shared/redux/reducers/argument-draft.reducer';
import { TextSize } from 'shared/styles';
import { AccentColor, Color } from 'shared/styles/colors';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import { StakeType } from 'shared/types/stake';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import { toastOptions } from 'shared/utils/toast';
import ValidationUtil from 'shared/utils/validation';
import BaseTextArea from 'web/src/components/Base/BaseTextArea';
import SignInComponent from 'web/src/components/Login/SignInComponent';
import MarkdownControls from 'web/src/components/Markdown/MarkdownControls';
import MarkdownInput from 'web/src/components/Markdown/MarkdownInput';
import ArgumentSharerModal from 'web/src/components/Modals/ArgumentSharerModal';
import OutOfTruModal from 'web/src/components/Modals/OutOfTruModal';
import StakeConfirmationModal from 'web/src/components/Modals/StakeConfirmationModal';
import StakingLimitModal from 'web/src/components/Modals/StakingLimitModal';
import { Routes } from 'web/src/navigation/Routes';

interface Props {
  claimId: ID;
  community: string;
  account?: Account;
  settings: Settings;
  drafts: ArgumentDraft[];
  style?: React.CSSProperties;
  addDraftArgument: (claimId: ID, argumentText: string) => void;
  addDraftSummary: (claimId: ID, summaryText: string) => void;
  addDraftVote: (claimId: ID, vote: boolean) => void;
  removeDraft: (claimId: ID) => void;
  onArgumentAdded: (addedArgumentId: string) => void;
}

const AddArgumentComponent = (props: WithApolloClient<Props>) => {

  const { client, community, account, settings, style, addDraftArgument, addDraftSummary, addDraftVote, removeDraft, claimId, drafts, onArgumentAdded } = props;

  const find = drafts.find((draft: ArgumentDraft) => draft.claimId === claimId);
  const [ argumentText, setArgumentText ] = React.useState(find && find.argumentText ? find.argumentText : '');
  const [ summaryText, setSummaryText ] = React.useState(find && find.summaryText ? find.summaryText : '');
  const [ vote , setVote ] = React.useState(find && (find.vote || find.vote === false) ? find.vote : true);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const markdownRef = React.useRef<MarkdownInput>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [ showAddArgumentContainer, setShowAddArgumentContainer ] = React.useState(false);
  const { argumentBodyMaxLength, argumentBodyMinLength, argumentSummaryMaxLength, argumentSummaryMinLength } = settings;

  const updateText = (text: string) => {
    addDraftArgument(claimId, argumentText);
    setArgumentText(text);
  };
  const updateSummaryText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    addDraftSummary(claimId, e.target.value);
    setSummaryText(e.target.value);
  };
  const updateVote = (text: string) => {
    addDraftVote(claimId, text === 'Back');
    setVote( text === 'Back' );
  };

  const postArgument = async (vote: boolean, argument: string, summary: string) => {
    LoadingBlanketHandler.show();
    setShowAddArgumentContainer(false);
    try {
      const stakeType =  vote === true ? StakeType.Backing : StakeType.Challenge;
      const stakeTypeDescription =  vote === true ? 'Backing' : 'Challenge';
      const resp = await Chain.submitArgument({
        claimId: claimId,
        stake_type: stakeType,
        summary,
        body: argument,
      });
      console.log('PUBLISH RESPONSE: ', resp);
      Analytics.track(AnalyticsEventsWeb.AddArgumentSubmitted, {
        claimId: claimId,
        community: community,
        type: stakeType,
        typeDescription: stakeTypeDescription,
      });

      setArgumentText('');
      setSummaryText('');
      setVote(true);
      removeDraft(claimId);
      onArgumentAdded(resp.id);

      BaseModalHandler.basic(
        <ArgumentSharerModal
          onClose={ () => BaseModalHandler.close() }
          url={ `${AppConfig.base_url}${Routes.CLAIM}${resp.claim_id}${Routes.ARGUMENT}${resp.id}` }
          body={ resp.summary }
        />,
        { width: '100%', maxWidth: 480, paddingLeft: '0px', paddingRight: '0px' },
      );

      client.query({
        query: CLAIM_QUERY,
        variables: { claimId: claimId },
        fetchPolicy: 'network-only',
      });
      if (account !== undefined) {
        client.query({
          query: APP_ACCOUNT_BALANCE_QUERY,
          variables: { id: account.address },
          fetchPolicy: 'network-only',
        });
      }
    } catch (err) {
      if (err.code === CodeType.CodeMinBalance) {
        BaseModalHandler.basic(<OutOfTruModal onClose={ () => BaseModalHandler.close() } />);
      } else if (err.code === CodeType.CodeMaxAmountStakingReached) {
        BaseModalHandler.basic(<StakingLimitModal onClose={ () => BaseModalHandler.close() } />);
      } else {
        toast.error(`Your ${ vote ? 'back' : 'challenge' } argument failed to submit: ${err}`, toastOptions);
      }
      setShowAddArgumentContainer(true);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const noEvent = () => { };
  const confirmSubmit = () => {
    const validateResults = validate();
    if (validateResults.length === 0) {
      const onSubmit = () => {
        AlertModalHandler.close();
        postArgument(vote, argumentText, summaryText);
      };
      const onClose = () => AlertModalHandler.close();
      AlertModalHandler.basic(<StakeConfirmationModal onSubmit={ onSubmit } onClose={ onClose } vote={ vote } />);

    } else {
      toast.error(validateResults[0], toastOptions);
    }
  };

  if (!account) {
    return (
      <React.Fragment>
        <BaseLine style={ { marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } } />
        <SignInComponent
          text={ Language.SIGN_IN_COMMENTS }
        />
      </React.Fragment>
    );
  }

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
  const submitText =  `I ${vote ? 'back' : 'challenge'} this claim`;

  const toggleArgument = () => { setShowAddArgumentContainer(!showAddArgumentContainer); };

  return (
    <div style={ { ...styles.container, ...style } }>
      <div style={ { justifyContent: 'center', alignItems: 'center', display: 'flex' } }>
        <BaseButton
          title={ 'Write Argument' }
          color={ Color.APP_PURPLE }
          accentColor={ Color.APP_PURPLE }
          outline={ true }
          onAction={ toggleArgument }
          width={ 180 }
          style={ { display: ( showAddArgumentContainer ? 'none' : 'flex' ) } }
        />
      </div>
      <SlideDown className={ 'add-argument' }>
        <div style={ { display: ( showAddArgumentContainer ? 'block' : 'none') } }>
          <div style={ { ...styles.sectionContainer, flexWrap: 'wrap', display: 'flex' } } className={ 'add-argument-controls' }>
            <AppAccountAvatar appAccount={ account } style={ { justifyContent: 'flex-start' } } />
            <div className={ 'is-hidden-mobile' } style={ { flex: 1 } }>
              <BaseText>Argument</BaseText>
            </div>
            <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
              <MarkdownControls
                textAreaRef={ textAreaRef }
                onMarkdownGenerated={ onMarkdownGenerated }
                onMarkdownModified={ onMarkdownModified }
                showPreview={ showPreview }
                onPreviewToggled={ onPreviewToggledAction }
                style={ styles.markdownControlContainer }
              />
            </div>
          </div>
          <div style={ { ...styles.sectionContainer } }>
            <div style={ { display: 'flex', alignItems: 'center' } }>
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
          { /* tslint:disable-next-line: max-line-length */ }
          <div style={ { ...styles.sectionContainer, borderColor: summaryText.length > 0 && (summaryText.length < argumentSummaryMinLength || summaryText.length > argumentSummaryMaxLength) ? Color.RED : Color.LINE_GRAY } }>
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
          <div style={ { display: 'flex', marginTop: Whitespace.MEDIUM, alignItems: 'center' } }>
            <div style={ { display: 'flex', flex: 1 } }>
              <BaseButton
                title={ 'Cancel' }
                onAction={ toggleArgument }
                height={ 27 }
                width={ 65 }
    // tslint:disable-next-line: max-line-length
                hoverColors={ { regularBackground: Color.WHITE, regularText: Color.APP_PURPLE, hoverBackground: Color.WHITE, hoverText: Color.APP_PURPLE } }
                disabled={ false }
                textSize={ TextSize.H5 }
              />
            </div>
            <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
              <BaseButton
                title={ submitText }
                onAction={ confirmSubmit }
                height={ 36 }
                width={ 160 }
                color={ vote ? Color.BACK : Color.CHALLENGE }
                accentColor={ vote ? Color.BACK : Color.CHALLENGE }
                borderRadius={ Whitespace.LARGE }
                disabled={ disabled }
                textSize={ TextSize.H5 }
              />
            </div>
          </div>
        </div>
      </SlideDown>
    </div >
  );
};

const styles = {
  container: { },
  markdownControlContainer: {
    justifyContent: 'space-between',
    width: 250,
  },
  sectionContainer: {
    border: `1px solid ${Color.LINE_GRAY}`,
    padding: Whitespace.MEDIUM,
    borderRadius: Whitespace.TINY,
    marginBottom: Whitespace.SMALL,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: Whitespace.MEDIUM,
    marginLeft: Whitespace.SMALL + 1,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
  drafts: state.drafts.drafts,
});

const mapDispatchToProps = (dispatch: any) => ({
  addDraftArgument: (claimId: ID, argumentText: string) => {
    return dispatch(addDraftArgument(claimId, argumentText));
  },
  addDraftSummary: (claimId: ID, summaryText: string) => {
    return dispatch(addDraftSummary(claimId, summaryText));
  },
  addDraftVote: (claimId: ID, vote: boolean) => {
    return dispatch(addDraftVote(claimId, vote));
  },
  removeDraft: (claimId: ID) => {
    return dispatch(removeDraft(claimId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withApollo(AddArgumentComponent));
