import React, { useEffect, useState } from 'react'
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBoardById } from '../../actions/actionCreators/boardActions'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import {
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Modal,
  Menu,
  MenuItem,
} from '@material-ui/core'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import GetAppIcon from '@material-ui/icons/GetApp'
import { User, Edit, Trash2, MoreVertical } from 'react-feather'
import { fetchAllCompaniesInfo } from '../../actions/actionCreators/companyActions'
import { fetchAllCardsV2 } from '../../actions/actionCreators/cardActions'
import { fetchAllLists } from '../../actions/actionCreators/listActions'
import {
  fetchAllUsersInfo,
  updateUser,
} from '../../actions/actionCreators/userActions'

function rand() {
  return Math.round(Math.random() * 20) - 10
}

const projectStatusColor = (status) => {
  let color
  let backgroundColor
  switch (status) {
    case 'Kick Off':
      backgroundColor = 'white'
      color = 'black'
      break
    case 'In Progress':
      backgroundColor = 'green'
      color = 'white'
      break
    case 'Installation & Commissioning':
      backgroundColor = 'cyan'
      color = 'black'
      break
    case 'Validation':
      backgroundColor = 'blue'
      color = 'white'
      break
    case 'Closed':
      backgroundColor = 'gray'
      color = 'white'
      break

    default:
      backgroundColor = 'white'
      color = 'white'
      break
  }
  return [color, backgroundColor]
}

function getModalStyle() {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const ProjectCard = ({ board, ...rest }) => {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [openModal, setOpenModal] = useState(false)
  const { isValid, token, users, user } = useSelector((state) => state.user)
  const { allCards } = useSelector((state) => state.cards)
  const { lists, allLists } = useSelector((state) => state.lists)
  const { timelines } = useSelector((state) => state.timeline)
  const { companies } = useSelector((state) => state.company)
  const { boardState = board } = useSelector((state) => state.boards)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()

  let mappedPic = []
  let mappedCompany = []
  const [projectPic, setProjectPic] = useState([])
  useEffect(() => {
    if (isValid) {
      dispatch(fetchAllCompaniesInfo(token))
      dispatch(fetchAllUsersInfo(token))
      dispatch(fetchAllCardsV2(token))
      dispatch(fetchAllLists(token))
    }
  }, [])
  mappedPic = board?.pic?.map((pic) => {
    return users.find((user) => user._id === pic)?.username
  })
  mappedCompany = companies.find((company) => company._id === board.company)
    ?.companyName
  const handleClose = () => {
    setOpenModal(false)
  }

  const disableButton = () => {
    if (user.role === 'ADMIN') return false
    else if (board.userId === user.id) return false
    else return true
  }

  const disableDetailsButton = () => {
    if (user.role === 'ADMIN') return false
    else
      return board.pic.length > 0
        ? board?.pic?.some((item) => item !== user.id)
        : true
  }
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '50px',
      }}
      {...rest}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            pb: 3,
          }}
        >
          {/* <Button
            component={RouterLink}
            disabled={disableButton()}
            sx={{
              color: 'text.secondary',
              fontWeight: 'medium',
              justifyContent: 'flex-start',
              letterSpacing: 0,
              // py: 1.25,
              textTransform: 'none',
              width: '50%',
              color: 'primary.main',
            }}
            to={`/app/projects/edit/${board._id}`}
          >
            <Edit size="20" />
          </Button>
          <Button
            component="div"
            onClick={() => {
              setOpenModal(true)
            }}
            disabled={disableButton()}
            sx={{
              color: 'text.secondary',
              fontWeight: 'medium',
              justifyContent: 'flex-end',
              letterSpacing: 0,
              // py: 1.25,
              textTransform: 'none',
              width: '50%',
              color: 'primary.main',
            }}
          >
            <Trash2 size="20" />
          </Button> */}
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVertical size={20} />
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              component={RouterLink}
              to={`/app/projects/details/${board._id}`}
              disabled={disableDetailsButton()}
            >
              Details
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to={`/app/projects/edit/${board._id}`}
              disabled={disableButton()}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                const pin = {
                  id: board._id,
                  projectName: board.projectName,
                }
                const postUserReq = {
                  ...user,
                  pinned: [...user.pinned, pin],
                }
                dispatch(updateUser(postUserReq))
              }}
            >
              Pin
            </MenuItem>
            {user.role === 'ADMIN' && (
              <MenuItem
                onClick={() => {
                  setOpenModal(true)
                }}
                disabled={disableButton()}
              >
                Delete
              </MenuItem>
            )}
          </Menu>
        </Box>
        <Box component={RouterLink} to={`/app/projects/details/${board._id}`}>
          <Typography
            align="left"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            {board?.projectName || 'No Project Name Filled'}
          </Typography>
          <Typography
            align="left"
            color="textSecondary"
            gutterBottom
            variant="h6"
          >
            {mappedCompany || 'No Company Assigned'}
          </Typography>
          <Typography
            align="left"
            color="textPrimary"
            variant="body2"
            style={{ paddingTop: 10 }}
          >
            {board?.projectDescription || 'No Description Filled'}
          </Typography>
          {/* <Button
          component={RouterLink}
          sx={{
            color: 'text.secondary',
            fontWeight: 'bold',
            justifyContent: 'center',
            letterSpacing: 0,
            // py: 1.25,
            textTransform: 'none',
            width: '100%',
            color: 'primary.main',
          }}
          disabled={disableDetailsButton()}
          // disabled={true}
          to={`/app/projects/details/${board._id}`}
        >
          See Details
        </But</Box>ton> */}
        </Box>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box
        sx={{ p: 2 }}
        component={RouterLink}
        to={`/app/projects/details/${board._id}`}
      >
        <Grid container spacing={2} sx={{ justifyContent: 'space-between' }}>
          <Grid
            item
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <AccessTimeIcon color="action" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              {board?.startDate && board?.endDate
                ? `${moment(board.startDate).format('DD MMMM YYYY')} - ${moment(
                  board.endDate,
                ).format('DD MMMM YYYY')}`
                : 'No Start Date - End Date Filled'}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <User size="20" />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              {mappedPic?.join(', ') || 'No PIC Assigned'}
            </Typography>
          </Grid>
          <Modal open={openModal} onClose={handleClose}>
            <div style={modalStyle} className={classes.paper}>
              <h2 style={{ padding: 5 }}>Delete Project</h2>
              <p style={{ padding: 5 }}>
                Are you sure you want to delete this project
              </p>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 2,
                }}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ marginRight: 15 }}
                  onClick={() =>
                    dispatch(deleteBoardById(boardState._id, token)).then(
                      () => {
                        navigate('/app/projects', { replace: 'true' })
                      },
                    )
                  }
                >
                  Yes
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setOpenModal(false)}
                >
                  No
                </Button>
              </Box>
            </div>
          </Modal>
        </Grid>
      </Box>
      <Divider />
      <Box
        sx={{
          p: 2,
          backgroundColor: projectStatusColor(board?.status)[1],
        }}
        component={RouterLink}
        to={`/app/projects/details/${board._id}`}
      >
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
          sx={{
            color: projectStatusColor(board?.status)[0],
            fontWeight: 700,
          }}
        >
          {board?.status || 'No Project Status Filled'}
          {board?.status &&
            ` 
            ${(
              (allCards
                ?.filter((c) => c.boardId === board._id)
                ?.map((i) => {
                  const res = allLists?.filter((l) => i.listId === l._id)[0]
                  return res?.name
                })
                .reduce((acc, curVal) => {
                  curVal === 'Checked' || curVal === 'Done'
                    ? (acc += 1)
                    : (acc = acc)
                  return acc
                }, 0) /
                allCards?.filter((c) => c.boardId === board._id).length
              ) *
              // allCards.length
              100
            ).toFixed(0)
            }%`}
        </Typography>
      </Box>
    </Card>
  )
}

ProjectCard.propTypes = {
  board: PropTypes.object.isRequired,
}

export default ProjectCard
