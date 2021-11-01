import { useQuery } from 'react-query';
import axios from 'axios';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { AppTemperature, AppWind, AppLastSevenDaysAverage } from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { isLoading, data, error } = useQuery(
    'lastValues',
    async () => {
      const { data } = await axios.get(
        '/temporal/entities/urn:ngsi-ld:Device:node_red_temperature001?lastN=1',
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
      refetchInterval: 1 * 3600, // one minute
      refetchOnWindowFocus: false
    }
  );

  if (error) return `An error has occurred: ${error.message}`;

  return (
    <Page title="Enviromental Dashboard">
      <Container maxWidth="xl">
        {/* <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box> */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            {isLoading ? (
              <AppTemperature isLoading={isLoading} />
            ) : (
              <AppTemperature isLoading={isLoading} data={data.temperature} />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            {isLoading ? (
              <AppWind isLoading={isLoading} />
            ) : (
              <AppWind isLoading={isLoading} data={data.wind} />
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <AppLastSevenDaysAverage />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
