import highlightShare from 'highlight-share';
import React from 'react';
import SlideDown from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import * as AppConfig from 'shared/app-config.json';
import { ArgumentDetailProps } from 'shared/components/Argument/ArgumentDetails';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import DateUtil from 'shared/utils/date';
import { Routes } from 'web/src/navigation/Routes';
import * as clipboardSharer from 'web/src/services/clipboard-sharer';
import * as twitterSharer from 'web/src/services/twitter-sharer';
import ArgumentComments from './ArgumentComments';

const ArgumentDetails = (props: ArgumentDetailProps) => {
  const { argument, style, opened } = props;
  const { body } = argument;
  const [ argumentOpened, setArgumentOpened ] = React.useState(opened ? opened : false);

  let highlighter = highlightShare({
    selector: `.shareable-argument-${argument.id}`,
    sharers: [twitterSharer, clipboardSharer],
    shareUrl:  `${AppConfig.base_url}${Routes.CLAIM}${argument.claimId}${Routes.ARGUMENT}${argument.id}`,
  });
  if (argumentOpened) {
    highlighter.init();
  }

  const trackArgumentOpen = () => {
    const properties = { claimId: argument.claimId, argumentId: argument.id };
    try {
      const payload = {
        event: 'argument_opened',
        properties,
      };
      fetch(`/api/v1/track/?data=${window.btoa(JSON.stringify(payload))}`);
    } catch (e) { }
  };

  const onReadMore = () => {
    if (!argumentOpened) {
      // when opening
      trackArgumentOpen();
      highlighter.init();
    } else {
      // when closing
      var elems = document.getElementsByClassName('highlight-share-popover');
      for (let i = 0; i < elems.length; i++) {
        elems[i].remove();
      }
    }
    const eventType = argumentOpened ? AnalyticsEventsWeb.ReadLess : AnalyticsEventsWeb.ReadMore;
    Analytics.track(eventType, { claimId: argument.claimId, argumentId: argument.id , community: argument.communityId });
    setArgumentOpened(!argumentOpened);
  };

  const wasEdited = () => {
    if (!argument.edited) return null;
    return(
      <BaseText
        textSize={ TextSize.H6 }
        color={ Color.GRAY }
        style={ { fontStyle: 'italic', marginLeft: Whitespace.SMALL } }
      >
        { `Last edited on ${ DateUtil.format(argument.editedTime) }` }
      </BaseText>
    );
  };

  return (
    <div className={ 'argument-details' } style={ { ...styles.container, ...style } }>
      <SlideDown className={ 'read-more' }>
        <div style={ {  display: ( argumentOpened ? 'flex' : 'none' ) } } className={ `shareable-argument-${argument.id}` }>
          <ArgumentComments argument={ argument } argumentOpened={ argumentOpened }>
            { body }
          </ArgumentComments>
        </div>
      </SlideDown>
      <BaseActionable onAction={ onReadMore }>
        <BaseText
          color={ Color.APP_PURPLE }
          textSize={ TextSize.H5 }
        >
          { `Read ${argumentOpened ? 'Less' : 'More'}` }
        </BaseText>
        { wasEdited() }
      </BaseActionable>
    </div>
  );

};

const styles = {
  container: { },
};

export default ArgumentDetails;
