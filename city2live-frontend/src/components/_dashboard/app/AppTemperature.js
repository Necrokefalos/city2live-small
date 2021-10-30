import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------
dayjs.extend(utc);

export default function AppTemperature({ isLoading, data }) {
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon="carbon:temperature-celsius" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h5" sx={{ opacity: 0.72 }}>
        Temperature
      </Typography>
      {isLoading ? (
        <CircularProgress sx={{ color: (theme) => theme.palette.warning.darker }} size={54} />
      ) : (
        <Typography variant="h3">{`${data.value} ${data.unitCode.toLowerCase()}`}</Typography>
      )}
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {isLoading
          ? ''
          : `Last updated: ${dayjs(data.observedAt).utc().local().format('D/M/YY HH:mm')}`}
      </Typography>
    </RootStyle>
  );
}

AppTemperature.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.object
};
