import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AccountCircle from '@material-ui/icons/AccountCircle'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined'
import InputIcon from '@material-ui/icons/Input'
import Logo from './Logo'
import { logoutUser } from '../actions/actionCreators/userActions'

const DashboardNavbar = ({ onMobileNavOpen, onNotificationClick, ...rest }) => {
  const [notifications] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, users } = useSelector((state) => state.user)
  const [auth, setAuth] = React.useState(true)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleChange = (event) => {
    setAuth(event.target.checked)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const dummyUser = {
    avatar: '/static/images/avatars/kgi.png',
    jobTitle: 'Admin',
    name: 'Kuantum Gabe Integritas',
  }
  console.log('user navbar: ', user)
  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <IconButton color="inherit" onClick={onMobileNavOpen}>
          <MenuIcon />
        </IconButton>
        <RouterLink to="/">
          <div>
            <Logo width={300} />
          </div>
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        {/* <Hidden lgDown>
          <IconButton
            color="inherit"
            onClick={() => {
              dispatch(logoutUser())
              localStorage.setItem('auth-token', '')
              navigate('/login')
            }}
          >
            <InputIcon />
          </IconButton>
        </Hidden> */}
        {/* <Hidden lgUp> */}
        {/* <IconButton
          color="inherit"
          onClick={() => {
            dispatch(logoutUser())
            localStorage.setItem('auth-token', '')
            navigate('/login')
          }}
        >
          <InputIcon />
        </IconButton> */}
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          onClick={onNotificationClick}
        >
          <Badge
            badgeContent={
              users
                .filter((d) => d._id === user.id)[0]
                ?.notification?.filter((d) => d.read === false)?.length ?? 0
            }
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          {/* <AccountCircle /> */}
          <Avatar
            src={user?.avatar || dummyUser.avatar}
            sx={{
              cursor: 'pointer',
              width: 24,
              height: 24,
            }}
          />
        </IconButton>
        <Typography
          sx={{ marginLeft: '1rem' }}
          align="left"
          color="black"
          variant="h4"
        >
          <div>{user?.name}</div>
          <div>{user?.position}</div>
        </Typography>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              navigate('/app/settings')
            }}
          >
            Edit Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch(logoutUser())
              localStorage.setItem('auth-token', '')
              navigate('/login')
            }}
          >
            Logout
          </MenuItem>
        </Menu>
        {/* </Hidden> */}
      </Toolbar>
    </AppBar>
  )
}

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
}

export default DashboardNavbar
