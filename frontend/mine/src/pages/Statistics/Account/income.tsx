/** @jsxImportSource @emotion/react */
import React, {useState} from 'react';
import Analysis from './analysis';
import { Typography } from 'oyc-ds';
import { incomeCss } from './income.style';
import { filterExpenses } from '../../../utils/expensefilter';
import { income, spend, Spend } from '../../../utils/SpendData';
import Preview from './preview2';

export const expenses = spend;
export const incomes = income;

interface SpendChartProps {
  period: string;
  offset: number;
}

const Incomes: React.FC<SpendChartProps> = ({period, offset}) => {
  const [dataType, setDataType] = useState('spend'); // 지출/수입 데이터 타입 상태
  const data = dataType === 'spend' ? expenses : incomes;
  const filteredData = filterExpenses(data, period, offset)
    .sort((a, b) => b.money - a.money) as Spend[];
  const totalexpenditure = filteredData.reduce((acc, expense) => acc + expense.money, 0);

  return <>
    <Preview/>
  </>;
};

export default Incomes;
