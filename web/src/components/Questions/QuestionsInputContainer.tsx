import React, { ChangeEvent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ViewWidths } from '../../styles';
import BaseTextInput from '../Base/BaseTextInput';
import SignInButton from '../Login/SignInButton';

interface Props {
  account?: Account;
  postQuestion: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

const QuestionsInputContainer = (props: Props) => {
  const { postQuestion, style, account } = props;
  const [ question, setQuestion ] = React.useState('');

  const onPostQuestion = () => {
    postQuestion(question);
    setQuestion('');
  };

  const setQuestionText = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  if (!account) {
    return(
      <View style={ [ styles.emptyContainer, style ] }>
        <View style={ { flexDirection: 'column', flex: 1 } }>
          <BaseText textSize={ TextSize.H3 }color={ Color.WHITE }>
            Sign up to get your questions answered live and get a free summary of the debate!
          </BaseText>
          <BaseText color={ Color.WHITE } style={ { fontWeight: '200' } }>
            After each debate, we gather the best content and distribute it to our viewers.
          </BaseText>
        </View>
        <SignInButton />
      </View>
    );
  }

  return (
    <View style={ [ styles.container, style ] }>
      <View style={ styles.indentedContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>
          What questions do you have for the guests?
        </BaseText>
      </View>
      <View style={ { position: 'relative', marginTop: Whitespace.MEDIUM } }>
        <BaseTextInput
          placeholder={ 'Ask your question here' }
          value={ question }
          onChange={ setQuestionText }
          style={ webStyles.input }
        />
        <BaseButton
          title={ 'Submit' }
          hoverColors={ { regularBackground: Color.WHITE, regularText: Color.APP_PURPLE, hoverBackground: Color.WHITE, hoverText: Color.APP_PURPLE } }
          onAction={ onPostQuestion }
          style={ { position: 'absolute', right: -Whitespace.LARGE, top: -5 } }
          width={ 100 }
        />
      </View>
    </View>
  );
};

const webStyles = {
  input: {
    borderBottom: `1px solid ${Color.LINE_GRAY}`,
    paddingBottom: Whitespace.LARGE,
    marginTop: Whitespace.TINY,
    paddingTop: Whitespace.TINY,
    paddingRight: Whitespace.LARGE * 3 + Whitespace.TINY,
    paddingLeft: Whitespace.SMALL,
  },
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', maxWidth: ViewWidths.SITE },
  emptyContainer: {
    flexDirection: 'row',
    padding: Whitespace.LARGE,
    backgroundColor: Color.APP_PURPLE,
    borderRadius: Whitespace.TINY,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  indentedContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: Whitespace.CONTAINER,
    paddingLeft: Whitespace.CONTAINER,
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(QuestionsInputContainer);
