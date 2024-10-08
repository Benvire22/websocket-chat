import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { NavLink } from 'react-router-dom';

const AnonymousMenu = () => {
  return (
    <Grid>
      <Button sx={{ width: '100px' }} color="inherit" component={NavLink} to="/register">Sign up</Button>
      <Button sx={{ width: '100px' }} color="inherit" component={NavLink} to="/login">Sign in</Button>
    </Grid>
  );
};

export default AnonymousMenu;