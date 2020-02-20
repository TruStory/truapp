import * as React from 'react';
import { View } from 'react-native';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import { generateDocumentTitle } from '../utils';

const ValuesScreen = () => {

  generateDocumentTitle('Values And Guidelines');

  return (
    <div style={ styles.container }>
      <BaseText textSize={ TextSize.H2 } bold={ true }>Values</BaseText>
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>Be Inquistive</BaseText>
        <BaseText>Question everything. Nothing is true until proven true.</BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>Be Open-Minded</BaseText>
        <BaseText>
          Entertain different viewpoints and perspectives even if you are not convinced by them.
          You learn the most from people you disagree with the most.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>Be Assertive</BaseText>
        <BaseText>
          Have the conviction to defend your viewpoints.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>Be Humble</BaseText>
        <BaseText>
          Have the humility to change your viewpoints when someone has made a better point.
        </BaseText>
      </View>
      <View style={ { ...styles.valueTextContainer, marginBottom: Whitespace.LARGE + Whitespace.MEDIUM } }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>Be Transparent</BaseText>
        <BaseText>
          Be as honest and open as possible. This is how we build trust among one another.
        </BaseText>
      </View>
      <BaseText textSize={ TextSize.H2 } bold={ true }>Guidelines</BaseText>
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>1. Understand the Issue</BaseText>
        <BaseText>
          Avoid the knee-jerk reactions. Invest time upfront to truly understand the underlying issue being debated.
          Carefully read the claim and existing Arguments before writing your own.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>2. Ask Clarifying Questions</BaseText>
        <BaseText>
          Don't be afraid to ask questions if you don't understand someone's Argument or don't see how their logic and
          evidence proves the point the person is trying to make.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>3. Listen to Both Sides</BaseText>
        <BaseText>
          Fully understand the other side before offering your own. List any points of agreement as a way to acknowledge
          that you heard the other side.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>4. Be Direct</BaseText>
        <BaseText>
          Address the issue as directly as possible. Present just enough context for the audience but don't introduce
          too many tangents. If you have tangential points, save them for the chat.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>5. Provide a Unique Point of View</BaseText>
        <BaseText>
          It's easy to bandwagon off other thoughts but that's not going to get us any further. Instead, reason your way
          through the Argument independently. Bring your unique point of view to the table.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>6. Keep It Simple</BaseText>
        <BaseText>
          Keep Arguments simple and easy to understand. Don't be afraid to edit and delete 50% of the first draft to
          tighten up your argument. Simple is much harder than complex but leads to a more powerful Argument.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>7. Focus on the Issue, Not the Person</BaseText>
        <BaseText>
          Don't make Arguments personal by bringing people into it. The reason conversations becaome hard is because
          it becomes an attack on the ego. Keep your identity out of the discussion.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>8. Be Constructive</BaseText>
        <BaseText>
          No one likes to be shamed. Use constructive criticism. Your criticism should be constructed in a way that makes the
          other person want to respond.
        </BaseText>
      </View>
      <View style={ styles.valueTextContainer }>
        <BaseText bold={ true } textSize={ TextSize.H3 }>9. Admit When You're Wrong</BaseText>
        <BaseText>
          It's okay to be wrong. Seek to understand rather than to be right. Openly acknowledge when you are wrong and be willing to
          change your mind.
        </BaseText>
      </View>
    </div>
  );

};

const styles = {
  container: { },
  valueTextContainer: {
    flexDirection: 'column' as 'column',
    marginBottom: Whitespace.LARGE,
  },
};

export default ValuesScreen;
