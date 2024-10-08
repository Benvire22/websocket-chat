import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Button, Menu, MenuItem } from '@mui/material';
import { User } from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/users/usersThunks';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await dispatch(logout());
    handleClose();
  };

  return (
    <Grid>
      <Button color="inherit" sx={{ fontSize: '18px', textTransform: 'none' }} onClick={handleClick}>
        {user.displayName ? user.displayName : user.username}
      </Button>
      <Menu open={isOpen} onClose={handleClose} anchorEl={anchorEl} keepMounted>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Grid>
  );
};

export default UserMenu;
