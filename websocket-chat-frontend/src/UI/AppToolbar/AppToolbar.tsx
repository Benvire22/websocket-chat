import { AppBar, styled, Toolbar, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import UserMenu from './UserMenu';
import AnonymousMenu from './AnonymousMenu';

const StyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="sticky" sx={{ mb: 2 }}>
      <Toolbar>
        <Grid sx={{ mx: 'auto' }} container size={10} justifyContent="space-between" alignItems="center" maxWidth="xl">
          <Grid>
            <Typography variant="h6" component="div">
              <StyledLink to="/">Music app</StyledLink>
            </Typography>
          </Grid>
          {user ? <UserMenu user={user} /> : <AnonymousMenu />}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
