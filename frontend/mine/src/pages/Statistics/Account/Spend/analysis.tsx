/** @jsxImportSource @emotion/react */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
} from 'chart.js';
import { containerCss, msgCss } from '../analysis.style';
import { useSuspenseQuery } from '@tanstack/react-query';
import { spendMsg } from '../../../../apis/statisticsApi';
import { calculateDateRange } from '../../../../utils/SpendData';
import { useMemo } from 'react';
import { Typography } from 'oyc-ds';

ChartJS.register(
  CategoryScale,
  Legend,
  ChartDataLabels
);

interface SpendChartProps {
  period: string;
  offset: number;
  curSum?: number;
  analysis?: string;
  preSum?: number;
}

const Analysis: React.FC<SpendChartProps> = ({ period, offset, curSum }) => {
  const { startDate, endDate } = calculateDateRange(period, offset);
  const { data, error, isFetching } = useSuspenseQuery({
    queryKey: ['spendmsg', period, offset],
    queryFn: async () => {
      const result = await spendMsg(startDate, endDate);
      console.log(result);
      return result;
    },
  });

  if (error && !isFetching) {
    throw error;
  }

  const prevSum = data?.data.prevSum || 0;
  const diff = (curSum || 0) - prevSum;
  const maxSum = Math.max(prevSum, curSum || 0);

  const renderMessage = useMemo(() => {
    if (!curSum) return 0;

    if (diff >= 0) {
      return <h2>저번에 비해 {diff.toLocaleString()}원 더 썼어요!</h2>;
    } else {
      return <h2>저번에 비해 {(-diff).toLocaleString()}원 덜 썼어요!</h2>;
    }
  }, [curSum, diff]);

  const barData = {
    labels: ['이전 합계', '현재 합계'],
    datasets: [
      {
        label: '합계 비교',
        data: [prevSum, curSum],
        backgroundColor: [
          '#EEE1FF',
          '#CDB7FF',
        ],
        maxBarThickness:60, // 막대의 최대 두께를 제한하여 높이 조정
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    plugins: {
      legend: { 
        display: false
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value) => `${value.toLocaleString()}원`,
        color: 'black',
        font: {
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { display: false },
        max: maxSum * 1.7, // 최대값을 약간 더 크게 설정해 여유 공간 확보
      },
      y: {
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  return (
    <div css={containerCss}>
        <Typography
          color="dark"
          size="md"
          weight="bold"
          className='content'
        >
          {renderMessage} 
        </Typography>
      <Bar data={barData} options={options} height={'70%'} />
      <div css={msgCss}>
        <Typography
          color="dark"
          size="md"
          weight="bold"
        >
          소비 패턴 분석 메시지
        </Typography>
        <Typography
          color="dark"
          size="sm"
          weight="medium"
          className='content'
          
        >
          {data?.data.analysis}
        </Typography>
      </div>
    </div>
  );
};

export default Analysis;
