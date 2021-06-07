import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined'
import InputIcon from '@material-ui/icons/Input'
import Logo from './Logo'
import { logoutUser } from '../actions/actionCreators/userActions'

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const [notifications] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
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
        </Hidden>
        <Hidden lgUp>
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
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
}

export default DashboardNavbar
