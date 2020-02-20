
import React from 'react';
import { StyleProp } from 'react-native';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Chain from 'shared/blockchain';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Claim } from 'shared/types/claim';
import { Settings } from 'shared/types/settings';
import { toastOptions } from 'shared/utils/toast';
import EditImage from './EditImage';

export interface ClaimImageProps{
  account?: Account;
  settings: Settings;
  claim: Claim;
  style?: StyleProp<any> & React.CSSProperties;
}

const ClaimImage = (props: ClaimImageProps) => {

  const { claim, style, account, settings } = props;

  const [ hover, setHover ] = React.useState(false);

  const uploadImageUrl = async (imageLink: string) => {
    try {
      const resp = await Chain.editClaimImage({
        claim_id: claim.id,
        claim_image_url: imageLink,
      });
      console.log('PUBLISH RESPONSE: ', resp);
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error(`Your image failed to upload: ${err}`, toastOptions);
      LoadingBlanketHandler.hide();
    }
  };

  if (account && (account.id === claim.creator.id || settings.claimAdmins.includes(account.id)) ) {
    return (
      <div
        onMouseEnter={ () => setHover(true) }
        onMouseLeave={ () => setHover(false) }
        style={ { position: 'relative' } }
      >
        <div style={ { display: hover ? 'flex' : 'none' , ...styles.editButton } } >
          <EditImage
            onUpload={ uploadImageUrl }
            color={ Color.WHITE }
            size={ IconSize.XSMALL }
          />
        </div>
        <img src={ claim.image } style={ { ...styles.container, ...style } } />
        <div style={ { display: hover ? 'block' : 'none', ...styles.overlay } } />
      </div>
    );
  }

  return (
    <img src={ claim.image } style={ { ...styles.container, ...style } } />
  );

};

const styles = {
  container: {
    width: '100%',
    maxHeight: 500,
    borderRadius: Whitespace.TINY,
    objectFit: 'cover',
  },
  editButton: {
    position: 'absolute' as 'absolute',
    width: 100,
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 0,
    bottom: 0,
    height: 30,
    marginTop: 'auto',
    marginBottom: 'auto',
    zIndex: 50,
  },
  overlay: {
    backgroundColor: Color.BLACK,
    opacity: 0.7,
    position: 'absolute' as 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: Whitespace.TINY,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(ClaimImage);

