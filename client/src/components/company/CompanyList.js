import React, { useEffect, useState } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
} from '@material-ui/core'
import { Edit, Trash2, BookOpen } from 'react-feather'
import { makeStyles } from '@material-ui/core/styles'
import Loading from '../Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchAllCompaniesInfo,
  deleteCompanyById,
} from '../../actions/actionCreators/companyActions'
import { fetchAllUsersInfo } from '../../actions/actionCreators/userActions'

function rand() {
  return Math.round(Math.random() * 20) - 10
}
function getModalStyle() {
  const top = 50
  const left = 50

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
const CompanyList = (props) => {
  const classes = useStyles()
  const { token, users, user } = useSelector((state) => state.user)
  const { company, companies, companyLoading } = useSelector(
    (state) => state.company,
  )
  const [openModal, setOpenModal] = useState(false)
  const [modalContent, setModalContent] = useState({})
  const [openViewModal, setOpenViewModal] = useState(false)
  const [viewModalContent, setViewModalContent] = useState({})
  const [deleteId, setDeleteId] = useState('')
  const [modalStyle] = useState(getModalStyle)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log('token: ', token)
  useEffect(() => {
    dispatch(fetchAllCompaniesInfo(token))
    dispatch(fetchAllUsersInfo(token))
    // dispatch(fetchAllBoards(token))
  }, [dispatch])
  console.log('companies:', companies)
  let mappedTeam = []
  mappedTeam = companies?.map((company) => {
    console.log('company:', company)
    return company.companyTeam
      .map((team) => {
        return users.find((user) => user._id === team)?.username
      })
      .filter((d) => d)
  })
  console.log('mappedTeam:', mappedTeam)

  const handleClose = () => {
    setOpenModal(false)
  }

  const handleViewClose = () => {
    setOpenViewModal(false)
  }

  return (
    <>
      {companyLoading ? (
        <Loading />
      ) : (
        <Card {...props}>
          {/* <CardHeader title="Company List" /> */}
          {/* <Divider /> */}
          <PerfectScrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <h3>Name</h3>
                    </TableCell>
                    <TableCell>
                      <h3>Email</h3>
                    </TableCell>
                    {/* <TableCell>Address</TableCell> */}
                    {/* <TableCell>Team</TableCell> */}
                    <TableCell>
                      <h3>Action</h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies?.map((item, index) => (
                    <>
                      <TableRow hover key={item._id}>
                        <TableCell>{item.companyName}</TableCell>
                        <TableCell>{item.companyEmail}</TableCell>
                        {/* <TableCell>{item.companyAddress}</TableCell> */}
                        {/* <TableCell>
                          {mappedTeam[index]?.join(', ') || '-'}
                        </TableCell> */}
                        <TableCell>
                          {' '}
                          <Button
                            // color="primary"
                            variant="contained"
                            onClick={() => {
                              console.log('view item', item)
                              let team = []
                              team = item.companyTeam
                                .map((t) => {
                                  return users.find((user) => user._id === t)
                                    ?.username
                                })
                                .filter((d) => d)
                              console.log('team item:', team)
                              const newCompanyValue = { ...item, team: team }
                              setViewModalContent(newCompanyValue)
                              console.log('newCompanyValue:', newCompanyValue)
                              setOpenViewModal(true)
                            }}
                            style={{
                              marginRight: 5,
                            }}
                            sx={{
                              backgroundColor: 'blue',
                            }}
                            key={`view-${item._id}`}
                          >
                            <BookOpen size="20" />
                          </Button>
                          <Button
                            component={RouterLink}
                            color="primary"
                            variant="contained"
                            disabled={user.role !== 'ADMIN'}
                            to={`/app/company/edit/${item._id}`}
                            style={{
                              marginRight: 5,
                            }}
                            key={`edit-${item._id}`}
                          >
                            <Edit size="20" />
                          </Button>
                          {item._id !== company.id && (
                            <Button
                              color="secondary"
                              variant="contained"
                              disabled={
                                item._id === company.id || user.role !== 'ADMIN'
                              }
                              onClick={() => {
                                setOpenModal(true)
                                setDeleteId(item._id)
                              }}
                              style={{
                                marginRight: 5,
                              }}
                              key={`delete-${item._id}`}
                            >
                              <Trash2 size="20" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
          <Modal
            open={openViewModal}
            onClose={handleViewClose}
            // key={`view-modal-${item._id}`}
          >
            <div style={modalStyle} className={classes.paper}>
              <h2 style={{ padding: 5, textAlign: 'center', marginBottom: 15 }}>
                {viewModalContent.companyName}
              </h2>
              <p style={{ padding: 5, marginBottom: 15 }}>
                Email: {viewModalContent.companyEmail}
              </p>
              <p style={{ padding: 5, marginBottom: 15 }}>
                Alamat: {viewModalContent.companyAddress}
              </p>
              {viewModalContent?.team?.length > 0
                ? viewModalContent?.team?.map((t) => {
                    return (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: '#bcbcbc',
                          border: '1px solid darkblue',
                          padding: 3,
                          marginBottom: 5,
                          borderRadius: 5,
                        }}
                      >
                        {t}
                      </Box>
                    )
                  })
                : null}
            </div>
          </Modal>
          <Modal open={openModal} onClose={handleClose}>
            <div style={modalStyle} className={classes.paper}>
              <h2 style={{ padding: 5 }}>Delete Company</h2>
              <p style={{ padding: 5 }}>
                {` Are you sure you want to delete this company ${deleteId}?  `}
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
                    dispatch(deleteCompanyById(deleteId, token))
                      .then(() => {
                        setOpenModal(false)
                      })
                      .then(() => {
                        navigate('/app/company', {
                          replace: 'true',
                        })
                      })
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
            }}
          ></Box>
        </Card>
      )}
    </>
  )
}

export default CompanyList
