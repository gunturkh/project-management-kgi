import React, { useEffect } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Avatar,
  Box,
  // Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
} from '@material-ui/core'
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  LogOut as LogOutIcon,
  Briefcase,
  MapPin,
  Trash2,
} from 'react-feather'
import NavItem from './NavItem'
import PinItem from './PinItem'
import { updateUserNotificationStatusById } from '../actions/actionCreators/userActions'

const dummyUser = {
  avatar: '/static/images/avatars/kgi.png',
  jobTitle: 'Admin',
  name: 'Kuantum Gabe Integritas',
}

const DashboardSidebar = ({
  onMobileClose,
  openMobile,
  onNotificationClose,
  openNotification,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, users } = useSelector((state) => state.user)
  const picData = users.filter((d) => d._id === user.id)[0]
  const dispatch = useDispatch()
  let items = []
  if (user.role === 'ADMIN') {
    items = [
      {
        href: '/app/dashboard',
        icon: BarChartIcon,
        title: 'Dashboard',
      },
      // {
      //   href: '/app/customers',
      //   icon: UsersIcon,
      //   title: 'Customers',
      // },
      {
        href: '/app/projects',
        icon: CalendarIcon,
        title: 'Projects',
      },
      // {
      //   href: '/app/products',
      //   icon: ShoppingBagIcon,
      //   title: 'Products',
      // },
      {
        href: '/app/account',
        icon: UserIcon,
        title: 'User Manager',
      },
      {
        href: '/app/company',
        icon: Briefcase,
        title: 'Company',
      },
      {
        href: '/app/settings',
        icon: SettingsIcon,
        title: 'Settings',
      },
      // {
      //   href: '/register',
      //   icon: UserPlusIcon,
      //   title: 'Register',
      // },
      // {
      //   href: '/404',
      //   icon: AlertCircleIcon,
      //   title: 'Error',
      // },
    ]
  } else if (user.role === 'MEMBER' || user.role === 'CLIENT') {
    items = [
      // {
      //   href: '/app/dashboard',
      //   icon: BarChartIcon,
      //   title: 'Dashboard',
      // },
      {
        href: '/app/projects',
        icon: CalendarIcon,
        title: 'Projects',
      },
      {
        href: '/app/settings',
        icon: SettingsIcon,
        title: 'Settings',
      },
    ]
  }

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose()
    }
  }, [location.pathname])

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: openMobile ? 'auto' : '70px',
      }}
    >
      {openMobile && (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
          }}
        >
          <Avatar
            component={RouterLink}
            src={user?.avatar || dummyUser.avatar}
            sx={{
              cursor: 'pointer',
              width: 64,
              height: 64,
            }}
            to="/app/account"
          />
          <Typography color="white" variant="h5">
            {user.name}
          </Typography>
          <Typography color="white" variant="body2">
            {user.position}
          </Typography>
          <Divider />
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        <List>
          {user.role === 'ADMIN' && (
            <>
              {' '}
              <NavItem
                openMobile={openMobile}
                href="/app/dashboard"
                key="Dashboard"
                title="Dashboard"
                icon={BarChartIcon}
              />
              <NavItem
                openMobile={openMobile}
                href="/app/projects"
                key="Projects"
                title="Projects"
                icon={CalendarIcon}
              />
              {user.pinned && user.pinned.length > 0
                ? user.pinned.map((pin, i) => {
                  return (
                    <PinItem
                      openMobile={openMobile}
                      href={`/app/projects/details/${pin.id}`}
                      key={`pin-${i}`}
                      title={`${pin.projectName}`}
                      id={pin.id}
                      icon={MapPin}
                    />
                  )
                })
                : null}
              <NavItem
                openMobile={openMobile}
                href="/app/account"
                key="User Manager"
                title="User Manager"
                icon={UserIcon}
              />
              <NavItem
                openMobile={openMobile}
                href="/app/company"
                key="Company"
                title="Company"
                icon={Briefcase}
              />
              <NavItem
                openMobile={openMobile}
                href="/app/settings"
                key="Settings"
                title="Settings"
                icon={SettingsIcon}
              />
            </>
          )}
          {(user.role === 'MEMBER' || user.role === 'CLIENT') && (
            <>
              <NavItem
                openMobile={openMobile}
                href="/app/projects"
                key="Projects"
                title="Projects"
                icon={CalendarIcon}
              />
              {user.pinned && user.pinned.length > 0
                ? user.pinned.map((pin, i) => {
                  return (
                    <Box display="flex">
                      <PinItem
                        openMobile={openMobile}
                        href={`/app/projects/details/${pin.id}`}
                        key={`pin-${i}`}
                        title={`${pin.projectName}`}
                        icon={MapPin}
                      />
                    </Box>
                  )
                })
                : null}
              <NavItem
                openMobile={openMobile}
                href="/app/settings"
                key="Settings"
                title="Settings"
                icon={SettingsIcon}
              />
            </>
          )}
          {/* {items.map((item) => (
            <NavItem
              openMobile={openMobile}
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))} */}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      {/*
      <Box
      sx={{
        backgroundColor: 'background.default',
          m: 2,
          p: 2,
      }}
      >
      <Typography align="center" gutterBottom variant="h4">
      Need more?
      </Typography>
      <Typography align="center" variant="body2">
      Upgrade to PRO version and access 20 more screens
      </Typography>
      <Box
      sx={{
        display: 'flex',
          justifyContent: 'center',
          pt: 2,
      }}
      >
      <Button
      color="primary"
      component="a"
      href="https://react-material-kit.devias.io"
      variant="contained"
      >
      See PRO version
      </Button>
      </Box>
      </Box>
      */}
    </Box>
  )
  console.log({ openMobile, onMobileClose })
  return (
    <>
      {/* <Hidden lgUp> */}
      {/* <Drawer
        anchor="left"
        onClose={onMobileClose}
        open={openMobile}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 256,
            top: 64,
            height: 'calc(100% - 64px)',
          },
        }}
      > */}
      <Box
        sx={{
          marginTop: '64px',
          height: 'calc(100% - 64px)',
          backgroundColor: '#38343C',
        }}
      >
        {content}
      </Box>
      {/* </Drawer> */}
      <Drawer
        anchor={'right'}
        open={openNotification}
        onClose={onNotificationClose}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 256,
            top: 64,
            height: 'calc(100% - 64px)',
            overflow: 'scroll',

          },
        }}
      >
        {picData?.notification &&
          picData.notification
            .filter((notif) => notif.read === false)
            .map((notif) => (
              <Card
                sx={{
                  padding: 1,
                  margin: 1,
                  backgroundColor: notif?.read ? 'white' : '#AAC2FF',
                  minHeight: '150px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  dispatch(
                    updateUserNotificationStatusById({
                      userId: user.id,
                      id: notif.id,
                    }),
                  )
                  navigate(`${notif.link}`)
                }}
              >
                <CardContent
                  // component={RouterLink}
                  // to={notif?.link ? `${notif.link}` : ''}
                  sx={{ color: 'black' }}
                >
                  {notif?.message}
                </CardContent>
                {/* <CardActions sx={{ justifyContent: 'flex-end' }}> */}
                {/*   <Button */}
                {/*     size="small" */}
                {/*     onClick={() => { */}
                {/*       dispatch( */}
                {/*         updateUserNotificationStatusById({ */}
                {/*           userId: user.id, */}
                {/*           id: notif.id, */}
                {/*         }), */}
                {/*       ) */}
                {/*     }} */}
                {/*   > */}
                {/*     Mark as read */}
                {/*   </Button> */}
                {/* </CardActions> */}
              </Card>
            ))
            .reverse()}
      </Drawer>
      {/* </Hidden> */}
      {/* <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)',
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden> */}
    </>
  )
}

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
}

DashboardSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false,
}

export default DashboardSidebar
