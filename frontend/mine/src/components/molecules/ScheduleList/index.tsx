/** @jsxImportSource @emotion/react */
import React, { CSSProperties } from 'react';
import { Typography } from 'oyc-ds';
import {
  bodyCss,
  categoryCss,
  containerCss,
  detailCss,
  iconWrapperCss,
} from './style';
import { scheduleCategoryData } from '../../../utils/scheduleUtils';
import { simpleFormatDate } from '../../../utils/dateUtils';

interface ScheduleListProps extends React.ComponentProps<'div'> {
  title: string;
  description: string;
  category: number;
  startDateTime: string;
  endDateTime: string;
}

const ScheduleList = ({
  title,
  description,
  category,
  startDateTime,
  endDateTime,
  ...props
}: ScheduleListProps) => {
  return (
    <div css={containerCss} {...props}>
      <div
        css={iconWrapperCss}
        style={
          { '--color': scheduleCategoryData[category].color } as CSSProperties
        }
      >
        {scheduleCategoryData[category].icon}
      </div>
      <div css={bodyCss}>
        <Typography size="md" color="dark">
          {title}
        </Typography>

        <Typography color="secondary" size="xs" weight="light">
          {simpleFormatDate(new Date(startDateTime))} ~{' '}
          {simpleFormatDate(new Date(endDateTime))}
        </Typography>
        <Typography color="secondary" size="sm" weight="light" css={detailCss}>
          <span css={categoryCss}>{scheduleCategoryData[category].name}</span>
          {description}
        </Typography>
      </div>
    </div>
  );
};

export default ScheduleList;
