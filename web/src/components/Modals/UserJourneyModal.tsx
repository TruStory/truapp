import React from 'react';
import { View } from 'react-native';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { AppAccount } from 'shared/types/appAccount';
import { UserJourney } from 'shared/types/journey';
import { journeyMatchMap } from 'shared/utils/journey';

interface Props {
  appAccount: AppAccount;
  onClose: () => void;
}

const UserJourneyModal = (props: Props) => {

  const { appAccount, onClose } = props;
  let contentJsx: React.ReactNode | React.ReactNode[];

  // tslint:disable: max-line-length
  if (appAccount.userJourney.length > 0) {
    const listJsx: React.ReactNode[] = [];
    appAccount.userJourney.map((step: UserJourney) => {
      listJsx.push(
        <div style={ { display: 'flex', ...styles.listItem } }>
          <BaseText style={ { flex: 1 } }>{ journeyMatchMap.get(step) }</BaseText>
        </div>,
        );
    });
    contentJsx = listJsx;
  }

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
          { appAccount.userProfile.username }
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
  listItem: {
    borderBottom: `1px solid ${Color.LINE_GRAY}`,
    paddingTop: Whitespace.LARGE,
    paddingBottom: Whitespace.TINY,
  },
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

export default UserJourneyModal;
