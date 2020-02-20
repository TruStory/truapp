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
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import ValidationUtil from 'shared/utils/validation';
import BaseTextArea from '../Base/BaseTextArea';

interface Props {
  account: Account;
  settings: Settings;
  claimId: ID;
  incomingClaimBody: string;
  onSubmit: (claimId: ID, claimBody: string) => void;
  onClose: () => void;
}

const EditClaimModal = (props: Props) => {

  const { onClose, incomingClaimBody, settings, onSubmit, claimId } = props;
  let contentJsx: React.ReactNode | React.ReactNode[];

  const [ claimBody, setClaimBody ] = React.useState(incomingClaimBody);
  const { minClaimLength, maxClaimLength } = settings;

  const updateClaimBody = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setClaimBody(e.target.value);
  };

  const validate = (): string[] => {
    return ValidationUtil.errors({
      body: [
        ValidationUtil.err(ValidationUtil.minLength(claimBody, minClaimLength),
          `Claim must be at least ${minClaimLength} characters`),
        ValidationUtil.err(ValidationUtil.maxLength(claimBody, maxClaimLength),
          `Claim must be less than ${maxClaimLength} characters`),
      ],
    });
  };

  const disabled = validate().length !== 0;

  const onSubmitAction = () => onSubmit(claimId, claimBody);

// tslint:disable: max-line-length
  contentJsx = (
      <React.Fragment>
        <div style={ { ...styles.sectionContainer } }>
          <BaseTextArea
              placeholder={ 'What is the claim?' }
              value={ claimBody }
              onChange={ updateClaimBody }
              style={ styles.input }
          />
          <CharacterCount
              text={ claimBody }
              textSize={ TextSize.H6 }
              minSize={ minClaimLength }
              maxSize={ maxClaimLength }
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
          Edit Claim
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
  input: {
    borderBottom: `1px solid ${Color.LINE_GRAY}`,
    paddingBottom: Whitespace.SMALL,
    marginTop: Whitespace.TINY,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(EditClaimModal);
