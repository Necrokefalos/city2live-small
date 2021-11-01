import { useQuery } from 'react-query';
import axios from 'axios';
import { merge } from 'lodash';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------
const getDailyAverage = (data, dates) => {
  if (!data) return [];
  const dailyAggr = data.reduce((accumulator, object) => {
    const date = object.observedAt.split('T')[0];
    if (!accumulator[date]) {
      accumulator[date] = { sum: 0, count: 0 };
    }
    accumulator[date].sum += +object.value;
    // eslint-disable-next-line no-plusplus
    accumulator[date].count++;
    return accumulator;
  }, Object.create(null));
  Object.keys(dailyAggr).forEach((date) => {
    const average = dailyAggr[date].sum / dailyAggr[date].count;
    return (dailyAggr[date].average = Math.round(average * 10) / 10);
  });
  return dates.map((date) => {
    if (dailyAggr[date]) return dailyAggr[date].average;
    // generate random temperature
    return 25.0;
  });
};

export default function AppLastSevenDaysAverage() {
  // get timestamps
  const currentDate = new Date();
  const dates = [];
  // eslint-disable-next-line no-plusplus
  for (let index = 1; index < 8; index++) {
    dates.push(dayjs(currentDate).subtract(index, 'day').toDate().toISOString().split('T')[0]);
  }
  const dataStartTimeTimestamp = new Date(dates[6]).toISOString();

  // get data
  const { isLoading, data, error } = useQuery(
    'last7Days',
    async () => {
      const { data } = await axios.get(
        `/temporal/entities/urn:ngsi-ld:Device:node_red_temperature001?attrs=wind%2Ctemperature&timerel=after&timeAt=${dataStartTimeTimestamp}`,
        {
          method: 'GET',
          headers: {
            'NGSILD-Tenant': 'openiot',
            'NGSILD-Path': '/',
            // eslint-disable-next-line prettier/prettier
            Accept: 'application/ld+json'
          }
        }
      );
      return data;
    },
    {
      // Refetch the data every (in miliseconds)
      refetchOnWindowFocus: false
    }
  );

  if (error) return `An error has occurred: ${error.message}`;

  // create chart lines

  const chartData = [
    {
      name: 'Temperature',
      type: 'area',
      data: isLoading ? [] : getDailyAverage(data.temperature, dates)
    },
    {
      name: 'Wind',
      type: 'area',
      data: isLoading ? [] : getDailyAverage(data.wind, dates)
    }
  ];

  // configure chart
  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [2, 2] },
    markers: { size: [2, 2] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['gradient', 'gradient'] },
    labels: dates,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Temperature & Wind Daily Average" subheader="Last 7 Days" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
        )}
      </Box>
    </Card>
  );
}
