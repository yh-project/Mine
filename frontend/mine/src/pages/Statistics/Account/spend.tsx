/** @jsxImportSource @emotion/react */
import React, {useState} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { spend, income, Spend } from '../../../utils/SpendData';
import { containerCss, itemsCss, spendCss, itembarCss, itemlabelCss, itempriceCss } from './style';
import DataTab from '../datatab';
import { Typography, MenuTab } from 'oyc-ds';
import AppBar from '../../../components/organisms/AppBar';
import { useNavigate } from "react-router-dom";
import { filterExpenses } from '../../../utils/expensefilter';
import Analysis from './analysis';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const expenses = spend;
export const incomes = income;

const AccountChart = () => {
  const [period, setPeriod] = useState('weekly'); // 선택된 기간 상태 관리
  const [offset, setOffset] = useState(0); // 이전 주 또는 달 선택을 위한 오프셋 상태
  const [dataType, setDataType] = useState('spend'); // 지출/수입 데이터 타입 상태
  const nav = useNavigate();

  const handleMenuChange = (menu: number) => {
    switch (menu) {
      case 0:
        setPeriod('weekly');
        setOffset(0);
        break;
      case 1:
        setPeriod('monthly');
        setOffset(0);
        break;
      case 2:
        setPeriod('yearly');
        setOffset(0);
        break;
      default:
        break;
    }
  };

  const handleDataTypeChange = (type: string) => {
    setDataType(type);
  };

  const data = dataType === 'spend' ? expenses : incomes;
  const filteredData = filterExpenses(data, period, offset)
    .sort((a, b) => b.money - a.money) as Spend[];
  const totalexpenditure = filteredData.reduce((acc, expense) => acc + expense.money, 0);

  const chartData = {
    labels: ['비율'],
    datasets: filteredData.map((expense, index) => ({
      label: expense.name,
      data: totalexpenditure > 0 ? [(expense.money / totalexpenditure) * 100] : [0],
      backgroundColor: expense.color,
      borderSkipped: false,
      borderRadius: {
        topLeft: index === 0 ? 8 : 0,
        bottomLeft: index === 0 ? 8 : 0,
        topRight: index === filteredData.length - 1 ? 8 : 0,
        bottomRight: index === filteredData.length - 1 ? 8 : 0,
      },
      stack: 'stack1',
    })),
  };

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { display: false },
        border: { display: false },
      },
    },
  };

  const getDisplayTimeframe = (): JSX.Element => {
    const today = new Date();
    let displayText: JSX.Element = <div></div>;

    if (period === 'monthly') {
      const currentMonth = today.getMonth();
      const monthNames = [
        '1월', '2월', '3월', '4월', '5월', '6월', 
        '7월', '8월', '9월', '10월', '11월', '12월'
      ];
      displayText = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>{monthNames[currentMonth - offset]}</span>
        </div>
      );
    } else if (period === 'weekly') {
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay());

      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7 * offset);

      const nextWeekStart = new Date(currentWeekStart);
      nextWeekStart.setDate(nextWeekStart.getDate() + 7 * (offset + 1));

      const formatDate = (date: Date) => date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });

      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

      const previousWeekEnd = new Date(previousWeekStart);
      previousWeekEnd.setDate(previousWeekStart.getDate() + 6);

      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

      displayText = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>
            {formatDate(previousWeekStart)}~{formatDate(previousWeekEnd)}
          </span>
        </div>
      );
    } else if (period === 'yearly') {
      const currentYear = today.getFullYear();
      displayText = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>{currentYear - offset}년</span>
        </div>
      );
    }

    return displayText;
  };

  return (
    <>
      <AppBar
        label="가계 통계"
        onBackClick={() => nav('/')}
      />
      <div css={containerCss}>
        <MenuTab
          color="light"
          size="sm"
          variant="rounded"
          onChangeMenu={handleMenuChange}
        >
          <div>주별</div>
          <div>월별</div>
          <div>연별</div>
        </MenuTab>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button onClick={() => handleDataTypeChange('spend')}>지출</button>
          <button onClick={() => handleDataTypeChange('income')}>수입</button>
        </div>
        <DataTab
          title={getDisplayTimeframe()}
          leftChild={<Typography
            color="dark"
            size="md"
            weight="medium"
            onClick={() => setOffset(offset + 1)}
          >
            {`<`}
          </Typography>}
          rightChild={<Typography
            color="dark"
            size="md"
            weight="medium"
            onClick={() => setOffset(offset - 1)}
          >
            {`>`}
          </Typography>}
        />
        <Typography color="dark" size="lg" weight="bold" css={spendCss}>
          총 {totalexpenditure.toLocaleString()}원을
          <br />
          {dataType === 'spend' ? '소비했어요' : '벌었어요'}
        </Typography>
        <Bar data={chartData} options={options} height={"50%"} />
        <div>
          {filteredData.map((item) => {
            const percentage = totalexpenditure > 0 ? (
              (item.money / totalexpenditure) * 100).toFixed(2) : 0;
            return (
              <section key={item.id} css={itemsCss}>
                <div css={itembarCss} style={{ backgroundColor: item.color }} />
                <div css={itemlabelCss}>
                  <Typography color="dark" size="md" weight="medium">
                    {item.name}
                  </Typography>
                  <Typography color="secondary" size="xs" weight="medium">
                    {percentage}%
                  </Typography>
                </div>
                <Typography color="dark" size="sm" weight="bold" css={itempriceCss}>
                  {item.money.toLocaleString()}원
                </Typography>
              </section>
            );
          })}
        </div>
      </div>
      <Analysis />
    </>
  );
};

export default AccountChart;
