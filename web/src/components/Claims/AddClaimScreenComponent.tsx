import React, { ChangeEvent, KeyboardEvent } from 'react';
import { compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import CharacterCount from 'shared/components/CharacterCount';
import { addClaimDraftClaim, addClaimDraftCommunity, addClaimDraftSource } from 'shared/redux/actions/claim-draft.action';
import { ClaimDraft } from 'shared/redux/reducers/claim-draft.reducer';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { AddClaimDraft } from 'shared/types/claim';
import { Community } from 'shared/types/community';
import { Settings } from 'shared/types/settings';
import ValidationUtil from 'shared/utils/validation';
import BaseTextArea from '../Base/BaseTextArea';
import BaseTextInput from '../Base/BaseTextInput';
import CommunityDropdown from '../Communities/CommunityDropdown';
import AddClaimHelp from './AddClaimHelp';

interface Props {
  settings: Settings;
  onSubmit: (draft: AddClaimDraft, tempId: ID) => void;
  claim_drafts: ClaimDraft[];
  addClaimDraftClaim: (tempId: ID, claimText: string) => void;
  addClaimDraftCommunity: (tempId: ID, communityId: string) => void;
  addClaimDraftSource: (tempId: ID, claimText: string) => void;
}

const AddClaimScreenComponent = (props: Props) => {
  const { settings, onSubmit, addClaimDraftClaim, addClaimDraftCommunity, addClaimDraftSource, claim_drafts } = props;

  const tempId = 1; // this is what we are using for now until we are able to show a selection screen for drafts
  const find: ClaimDraft | undefined = claim_drafts.find((draft: ClaimDraft) => draft.tempId === tempId);

  const [claim, setClaim] = React.useState(find && find.claimText ? find.claimText : '');
  const [source, setSource ] = React.useState(find && find.sourceText ? find.sourceText : '');
  const [communityId, setCommunityId] = React.useState(find && find.communityId ? find.communityId : '');
  const { minClaimLength, maxClaimLength } = settings;

  const updateCategoryId = (community: Community) => {
    const { id } = community;
    addClaimDraftCommunity(tempId, id);
    setCommunityId(id);
  };

  const onPublish = () => {
    onSubmit({ claim, source, communityId }, tempId);
  };
  const setClaimText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    addClaimDraftClaim(tempId, e.target.value);
    setClaim(e.target.value);
  };
  const setSourceText = (e: ChangeEvent<HTMLInputElement>) => {
    addClaimDraftSource(tempId, e.target.value);
    setSource(e.target.value);
  };

  const validate = (): string[] => {
    return ValidationUtil.errors({
      claim: [
        ValidationUtil.err(ValidationUtil.minLength(claim, minClaimLength),
          `Argument must be at least ${minClaimLength} characters`),
        ValidationUtil.err(ValidationUtil.maxLength(claim, maxClaimLength),
          `Argument must be less than ${maxClaimLength} characters`),
      ],
    });
  };

  const onSourceKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 32) event.preventDefault();
  };

  const disabled = communityId === '' || validate().length !== 0;

  return (
    <div style={ { ...styles.container } }>
      <Fade top={ true } duration={ 500 }>
        <div className={ 'columns is-centered' }>
          <div className={ 'column is-12-desktop' }>
            <BaseText textSize={ TextSize.H3 } bold={ true } style={ { ...styles.header, marginTop: Whitespace.LARGE } }>Start A Debate</BaseText>
            <BaseText textSize={ TextSize.H3 } style={ { ...styles.header, marginBottom: Whitespace.SMALL } }>Community*</BaseText>
            <CommunityDropdown
              onChange={ updateCategoryId }
              value={ communityId }
            />
            <div style={ { display: 'flex', alignItems: 'center', marginTop: Whitespace.SMALL } }>
              <BaseText textSize={ TextSize.H3 }  style={ { flex: 1 } }>Claim*</BaseText>
              <CharacterCount
                text={ claim }
                textSize={ TextSize.H6 }
                minSize={ minClaimLength }
                maxSize={ maxClaimLength }
                style={ { justifyContent: 'flex-end' } }
              />
            </div>
            <BaseTextArea
              placeholder={ 'What is the claim?' }
              value={ claim }
              onChange={ setClaimText }
              style={ styles.input }
            />
            <BaseText textSize={ TextSize.H3 } style={ styles.header }>Source (optional)</BaseText>
            <BaseTextInput
              placeholder={ 'What is the source?' }
              value={ source }
              onChange={ setSourceText }
              style={ styles.input }
              onKeyDown={ onSourceKeyDown }
            />
            <div style={ { display: 'flex', marginTop: Whitespace.MEDIUM, alignItems: 'center', justifyContent: 'flex-end' } }>
              <BaseButton
                title={ 'Submit' }
                onAction={ onPublish }
                height={ 36 }
                width={ 77 }
                color={ Color.APP_PURPLE }
                accentColor={ Color.APP_PURPLE }
                disabled={ disabled }
                textSize={ TextSize.H5 }
              />
            </div>
          </div>
        </div>
      </Fade>
      <Fade bottom={ true } duration={ 500 }>
        <AddClaimHelp />
      </Fade>
    </div>
  );
};

const styles = {
  container: { },
  header: {
    marginTop: Whitespace.MEDIUM,
    display: 'flex' as 'flex',
  },
  input: {
    borderBottom: `1px solid ${Color.LINE_GRAY}`,
    paddingBottom: Whitespace.SMALL,
    marginTop: Whitespace.TINY,
  },
};

const mapStateToProps = (state: any) => ({
  claim_drafts: state.claim_drafts.claim_drafts,
  settings: state.settings.settings,
});

const mapDispatchToProps = (dispatch: any) => ({
  addClaimDraftClaim: (tempId: ID, claimText: string) => {
    return dispatch(addClaimDraftClaim(tempId, claimText));
  },
  addClaimDraftCommunity: (tempId: ID, communityId: string) => {
    return dispatch(addClaimDraftCommunity(tempId, communityId));
  },
  addClaimDraftSource: (tempId: ID, sourceText: string) => {
    return dispatch(addClaimDraftSource(tempId, sourceText));
  },
});

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(AddClaimScreenComponent);
