import React from 'react'
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, ListItem } from '@material-ui/core'
import { Trash2 } from 'react-feather'
import { updateUser } from '../actions/actionCreators/userActions'

const PinItem = ({
  href,
  icon: Icon,
  title,
  openMobile,
  children,
  id,
  ...rest
}) => {
  const location = useLocation()
  const { isValid, token, users, user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const active = href
    ? !!matchPath(
        {
          path: href,
          end: false,
        },
        location.pathname,
      )
    : false

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        py: 0,
      }}
      {...rest}
    >
      <Button
        component={RouterLink}
        sx={{
          color: 'text.secondary',
          fontWeight: 'medium',
          justifyContent: 'flex-start',
          letterSpacing: 0,
          py: 1.25,
          textTransform: 'none',
          width: '100%',
          marginLeft: '5px',
          ...(active && {
            color: 'primary.main',
          }),
          '& svg': {
            mr: 1,
          },
        }}
        to={href}
      >
        {Icon && <Icon size="10" />}
        {openMobile && <span style={{ marginLeft: '5px' }}>{title}</span>}
      </Button>
      {openMobile && (
        <Button
          onClick={() => {
            const pin = {
              id: id,
              projectName: title,
            }
            const postUserReq = {
              ...user,
              pinned: user.pinned.filter((pin) => pin.id !== id),
            }
            dispatch(updateUser(postUserReq)).then(() => {
              console.log('pin done!', user)
              console.log('pin user:', postUserReq)
              console.log('pin delete clicked', title)
            })
          }}
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            // justifyContent: 'flex-start',
            // letterSpacing: 0,
            // py: 1.25,
            // textTransform: 'none',
            // width: '100%',
            // marginLeft: '5px',
            // ...(active && {
            //   color: 'primary.main',
            // }),
            // '& svg': {
            //   mr: 1,
            // },
          }}
        >
          <Trash2 size="10" />
        </Button>
      )}
    </ListItem>
  )
}

PinItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
  id: PropTypes.string,
}

export default PinItem
