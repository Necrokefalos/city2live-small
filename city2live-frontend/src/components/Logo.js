import PropTypes from 'prop-types';
// material
import { Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  // return <Box component="img" src="/static/logo.svg" sx={{ width: 40, height: 40, ...sx }} />;
  return (
    <Box component="div" sx={{ width: 40, height: 40, ...sx }}>
      <Typography variant="h3" color="textPrimary" sx={{ textDecoration: 'none', align: 'center' }}>
        City2Live
      </Typography>
    </Box>
  );
}
