import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';

interface UserMenuProps {
  loading: boolean;
  signedIn: boolean;
  userHash: string;
  onLogIn: () => void;
  onLogOut: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ loading, signedIn, userHash, onLogIn, onLogOut }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  if (loading) {
    return <CircularProgress size={30} />;
  }

  if (!signedIn) {
    return (
      <Button variant="text" data-cy="login" onClick={onLogIn} sx={{ my: 2, color: 'white', display: 'block' }}>
        Log In
      </Button>
    );
  }

  return (
    <>
      <Tooltip title="Open settings">
        <IconButton data-cy="open-profile-btn" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="User avatar" src={`https://avatars.dicebear.com/api/bottts/${userHash}.svg`} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem data-cy="logout-btn" onClick={onLogOut}>
          <Typography textAlign="center">Log Out</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
