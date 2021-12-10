import React from 'react'
import { Popover, Box, Button } from '@material-ui/core'
import PropTypes from 'prop-types'

/**
 * Dropdown popover
 * Usually for filter purpose
 *
 * @param {object}             props
 * @param {string || number}   props.pl
 * @param {string || number}   props.pl
 * @param {boolean}            props.borderLeft
 * @param {boolean}            props.borderRight
 * @param {string}             props.title
 *
 */

const DropdownPopover = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  return (
    <div
      style={{
        ...props.style,
        paddingLeft: props.pl || 0,
        paddingRight: props.pr || 0,
        borderRight: props.borderRight ? 'solid 1px rgb(227, 118, 118)' : 0,
        borderLeft: props.borderLeft ? 'solid 1px rgb(227, 118, 118)' : 0,
      }}
    >
      <Box
        component={Button}
        type="button"
        className="d-flex dropdown-popover-button"
        sx={{ display: 'flex', color: 'black', border: '1px solid #2064A4' }}
        onClick={handleClick}
      >
        {props.title}
        {/* <i className="material-icons">arrow_drop_down</i> */}
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{
          elevation: 2,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {props.children}
      </Popover>
    </div>
  )
}

export default DropdownPopover

DropdownPopover.defaultProps = {
  pl: 0,
  pr: 0,
  borderRight: false,
  borderLeft: false,
  title: '',
}

DropdownPopover.prototype = {
  pl: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pr: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRight: PropTypes.bool,
  borderLeft: PropTypes.bool,
  title: PropTypes.string,
}
