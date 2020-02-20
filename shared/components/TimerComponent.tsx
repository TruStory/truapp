import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Elapsed, ElapsedIdentifier, Time } from 'shared/types/date';
import { Settings } from 'shared/types/settings';
import DateUtil from 'shared/utils/date';

interface Props {
  label?: string;
  endTime: Time;
  color?: Color;
  onTimeUp?: () => void;
  timeUpMessage? : string;
  showFullTime?: boolean;
  align?: TextAlign;
  size?: TextSize;
  showElapsedLabel? : boolean;
  addBlockTime?: boolean;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  settings: Settings;
}

interface State {
  elapsed: number;
  delimited: string;
  unit: string;
  pastFuture: string;
  fireCallback: boolean;
}

class TimerComponent extends React.Component<Props, State> {
  private interval: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      elapsed: 0,
      delimited: '0',
      unit: 'seconds',
      pastFuture : ElapsedIdentifier.AGO,
      fireCallback: false,
    };

    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    const { endTime, onTimeUp, addBlockTime, settings } = this.props;
    let { fireCallback } = this.state;

    const time = addBlockTime ? DateUtil.addOffsetToTime(endTime, settings.blockIntervalTime) : endTime;
    const elapsed: Elapsed = DateUtil.elapsed(time);

    if (elapsed.pastFuture === ElapsedIdentifier.AGO) {
      if (onTimeUp && fireCallback) {
        fireCallback = false;
        onTimeUp();
      }
    } else {
      if (onTimeUp)
        fireCallback = true;
    }

    this.setState({
      elapsed: elapsed.number,
      delimited: elapsed.delimited,
      unit: elapsed.label,
      pastFuture: elapsed.pastFuture,
      fireCallback,
    });
  }

  renderTimeText() {
    const { elapsed, unit, pastFuture, delimited } = this.state;
    const { label, timeUpMessage, showFullTime, showElapsedLabel } = this.props;
    const title = (label ? label : '');
    const timeLabel = showFullTime ? delimited : `${elapsed} ${unit}`;

    return (
      `${title}${(pastFuture === ElapsedIdentifier.AGO && timeUpMessage ? timeUpMessage + ' ' : '')}` +
      `${timeLabel} ${showElapsedLabel ? pastFuture : '' }`
    );
  }

  render() {
    const { color, align, size, style } = this.props;

    return (
      <BaseText color={ color ? color : Color.APP_BLACK } align={ align } textSize={ size } style={ style }>
        { this.renderTimeText() }
      </BaseText>
    );
  }
}

const mapStateToProps = (state: any) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(TimerComponent);
