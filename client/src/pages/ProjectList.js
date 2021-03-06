import React, { useEffect, useState } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { Helmet } from 'react-helmet'
import {
  Box,
  Container,
  Grid,
  TextField,
  Pagination,
  Icon,
  RadioGroup,
  Radio,
  FormGroup,
  FormControlLabel,
  makeStyles,
  Checkbox,
  Button,
  Snackbar,
  Alert as MuiAlert,
} from '@material-ui/core'
import { styled, useTheme } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import ProjectListToolbar from '../components/project/ProjectListToolbar'
import ProjectCard from '../components/project/ProjectCard'
import Loading from '../components/Loading'
import DropdownPopover from '../components/DropdownPopover'
// import DateField from '../components/DateField'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import DatePicker from '@material-ui/lab/DatePicker'
import { fetchAllBoards } from '../actions/actionCreators/boardActions'
// import { fetchAllCardsV2 } from '../actions/actionCreators/cardActions'
import { fetchAllCompaniesInfo } from '../actions/actionCreators/companyActions'
// import { createNewActivity } from '../actions/actionCreators/activityActions'
import useMediaQuery from '@mui/material/useMediaQuery'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const CssTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    marginTop: 0,
  },
  '& label.Mui-focused': {
    color: '#2064A4',
  },
  '& .MuiInputBase-input': {
    padding: '8px',
  },
  '& .MuiInputLabel-root': {
    // color: '#2064A4',
    color: 'inherit',
    marginTop: '-11px',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#2064A4',
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#2064A4',
    },
    '&:hover fieldset': {
      borderColor: '#2064A4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2064A4',
    },
  },
})
const statusOptions = [
  {
    label: 'Kick Off',
    value: 'Kick Off',
  },
  {
    label: 'In Progress',
    value: 'In Progress',
  },
  {
    label: 'Installation & Commissioning',
    value: 'Installation & Commissioning',
  },
  {
    label: 'Validation',
    value: 'Validation',
  },
  {
    label: 'Closed',
    value: 'Closed',
  },
]

const useStyles = makeStyles(() => ({
  radio: {
    '&$checked': {
      color: '#e37676',
    },
  },
  checked: {},
}))

const ProjectFilters = (props) => {
  const classes = useStyles()

  const [filterCard, setFilterCard] = useState([])

  const [merchantFilter, setmerchantFilter] = useState({
    merchantFilter: [],
    merchantName: [],
  })

  const [status, setStatus] = useState(
    statusOptions.reduce((acc, currVal) => {
      acc[currVal.label] = false
      return acc
    }, {}),
  )

  const handleChange = (event) => {
    setStatus({
      ...status,
      [event.target.name]: event.target.checked,
    })
  }

  const [period, setPeriod] = useState({
    type: 'All',
    dateFrom: null,
    dateTo: null,
  })

  const [sortBy, setSortBy] = useState('asc')

  const [user, setUser] = useState({
    filter: [],
    search: '',
    loading: false,
  })

  // const debouncedSearch = useDebounce(user.search, 500)

  const [userData, setUserData] = useState([])

  const roleAdmin = props.role === 'SUPERADMIN' || props.role === 'ADMIN'

  //   Merchant filter callback
  useEffect(() => {
    const data = {
      merchantFilter: merchantFilter.merchantFilter,
      userFilter: user.filter,
      period,
      sortBy,
    }
    console.log('data filter merchant', data)
    props.getFilterData(data)
  }, [filterCard, merchantFilter.merchantFilter, user.filter, sortBy])

  //   Period filter callback and period filter card
  useEffect(() => {
    if (period.type === 'Date Range' && period.dateFrom && period.dateTo) {
      const checkPeriodCard = filterCard.filter(
        (data) => data.type === 'period',
      )

      const data = {
        merchantFilter: merchantFilter.merchantFilter,
        period,
        userFilter: user.filter,
      }
      console.log('data filter period', data)
      props.getFilterData(data)

      if (checkPeriodCard.length) {
        setFilterCard(
          filterCard.map((data) => {
            if (data.type === 'period') {
              return {
                label: `${moment(new Date(period.dateFrom)).format(
                  'DD MMMM YYYY',
                )} - ${moment(new Date(period.dateTo)).format('DD MMMM YYYY')}`,
                id: 'period',
                type: 'period',
              }
            }

            return data
          }),
        )
      } else {
        setFilterCard(
          filterCard.concat({
            label: `${moment(new Date(period.dateFrom)).format(
              'DD MMMM YYYY',
            )} - ${moment(new Date(period.dateTo)).format('DD MMMM YYYY')}`,

            type: 'period',

            id: 'period',
          }),
        )
      }
    }

    if (period.type === 'All') {
      setFilterCard(filterCard.filter((s) => s.type !== 'period'))

      const data = {
        merchantFilter: merchantFilter.merchantFilter,
        period,
      }
      props.getFilterData(data)
    }
  }, [period.type, period.dateFrom, period.dateTo])

  // const fetchAllUsers = async search => {
  //   setUser({
  //     ...user,
  //     loading: true,
  //   });
  //   const checkSearch = search && { searchBy: search };

  //   const users = await client.query({
  //     query: getAllUsersListQuery,
  //     fetchPolicy: 'no-cache',
  //     variables: {
  //       itemDisplayed: 25,
  //       ...checkSearch,
  //     },
  //   });

  //   const manipulateData = users.data.getAllUsers.data.map(data => ({
  //     ...data,
  //     checked: user.filter.includes(data.name),
  //   }));

  //   setUserData(manipulateData);
  //   setUser({
  //     ...user,
  //     loading: false,
  //   });
  // };

  // useEffect(() => {
  // fetchAllUsers(user.search);
  // }, [debouncedSearch])

  const onChangeProductFilter = (filter, type) => {
    if (type === 'sort') {
      setSortBy(filter)
    }

    const filteredMerchant = merchantFilter.merchantName.filter(
      (s) => s.label !== filter.label,
    )

    if (type === 'merchant') {
      if (!filteredMerchant.includes(filter.label)) {
        setFilterCard(
          filterCard.concat({
            label: filter.label,
            value: filter.value,
            type: 'merchant',
          }),
        )

        setmerchantFilter({
          ...merchantFilter,
          merchantFilter: merchantFilter.merchantFilter.concat([
            {
              value: filter.value,
              label: filter.label,
            },
          ]),
          merchantName: merchantFilter.merchantName.concat(filter.label),
        })
      } else {
        setFilterCard(filterCard.filter((s) => s.label !== filter.label))
        setmerchantFilter({
          ...merchantFilter,
          merchantFilter: merchantFilter.merchantFilter.filter(
            (s) => s.value !== filter.value,
          ),
          merchantName: merchantFilter.merchantName.filter(
            (s) => s !== filter.label,
          ),
        })
      }
    }

    if (type === 'period') {
      setPeriod({
        ...filter,
      })
    }

    if (type === 'user') {
      if (filter.checked) {
        setFilterCard(
          filterCard.concat({
            label: filter.label,
            id: filter.id,
            type: 'user',
          }),
        )

        setUser({
          ...user,
          filter: user.filter.concat(filter.label),
        })
      } else {
        setFilterCard(
          filterCard.filter(
            (s) => s.label !== filter.label && s.type === 'user',
          ),
        )
        setUser({
          ...user,
          filter: user.filter.filter((data) => data !== filter.label),
        })
      }
    }
  }

  const removeFilterCard = (data) => {
    console.log('data remove', data)
    if (data.type === 'merchant') {
      setFilterCard(filterCard.filter((s) => s.value !== data.value))
      setmerchantFilter({
        ...merchantFilter,
        merchantFilter: merchantFilter.merchantFilter.filter(
          (s) => s.value !== data.value,
        ),
        merchantName: merchantFilter.merchantName.filter(
          (s) => s !== data.label,
        ),
      })
    }

    if (data.type === 'period') {
      setPeriod({ type: 'All', dateTo: null, dateFrom: null })
      setFilterCard(filterCard.filter((s) => s.type !== data.type))
    }

    if (data.type === 'user') {
      setFilterCard(
        filterCard.filter((s) => s.label !== data.label && s.type === 'user'),
      )
      setUser({
        ...user,
        filter: user.filter.filter((user) => user !== data.label),
      })
    }
  }
  //   console.log('product filter period', period);

  // console.log('props', props)
  // console.log('status state', status)
  return (
    <Box sx={{ marginBottom: 3, maxWidth: 300 }}>
      {/* <Box style={{ color: '#A2A2A2' }}>FILTER</Box> */}
      {/* TODO: See if using DropdownPopover component has better UX */}
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: 5 }}>
        <React.Fragment>
          <div
            className="dropdown filter pr-4"
            // style={{
            //   borderRight: '1px solid rgb(227, 118, 118)',
            // }}
          >
            {/* <button
              className="btn btn-secondary dropdown-toggle btn-dashboard"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              data-flip="false"
              style={{ padding: 0 }}
            >
              <span className="m-r-sm">Merchant</span>
            </button> */}
            <div
              className="dropdown-menu dropdown-merchant dropdown-radio"
              aria-labelledby="dropdownMenuButton"
              x-placement="bottom-start"
            >
              {/* <DropdownPopover title="Filter" pl={roleAdmin ? 24 : 0} pr={24}> */}
              <div style={{ padding: 16, width: 200 }}>
                <div>
                  <FormGroup
                    aria-label="status"
                    name="status"
                    value={period.type}
                    onChange={(e) => {
                      onChangeProductFilter(
                        {
                          type: e.target.value,
                          dateTo: period.dateTo,
                          dateFrom: period.dateFrom,
                        },
                        'period',
                      )
                    }}
                  >
                    {props.data.map((filter, i) => {
                      return (
                        <FormControlLabel
                          value={filter.label}
                          control={
                            // <Radio
                            // classes={{
                            //   root: classes.radio,
                            //   checked: classes.checked,
                            // }}
                            // />
                            <Checkbox
                              // checked={status[filter.label]}
                              size="small"
                              color="primary"
                              checked={merchantFilter.merchantName.includes(
                                filter.label,
                              )}
                              // onChange={handleChange}
                              onChange={() => {
                                onChangeProductFilter(filter, 'merchant')
                              }}
                              name={filter.label}
                            />
                          }
                          label={
                            <span
                              style={{
                                // fontFamily: 'Open Sans',
                                fontWeight: 400,
                                fontSize: 12,
                              }}
                            >
                              {filter.label}
                            </span>
                          }
                        />
                      )
                    })}
                  </FormGroup>
                </div>
              </div>
              {/* </DropdownPopover> */}

              {/* {props.data ? (
                <React.Fragment>
                  {props.data.map((filter, i) => {
                    return (
                      <div
                        key={`filter-status-${i}`}
                        className="custom-control custom-checkbox"
                      >
                        <input
                          data-value={filter.value}
                          data-name={filter.label}
                          value={filter.value}
                          type="checkbox"
                          checked={merchantFilter.merchantName.includes(
                            filter.label,
                          )}
                          id={`customRadio-${i}`}
                          name={`customRadio-${i}`}
                          className="custom-control-input"
                          onChange={() => {
                            onChangeProductFilter(filter, 'merchant')
                          }}
                        />
                        <label
                          className={`custom-control-label merchant-${i}`}
                          htmlFor={`customRadio-${i}`}
                        >
                          {filter.label}
                        </label>
                      </div>
                    )
                  })}
                </React.Fragment>
              ) : (
                <div>Loading</div>
              )} */}
            </div>
          </div>
        </React.Fragment>

        {/* <DropdownPopover title="Period" pl={roleAdmin ? 24 : 0} pr={24}> */}
        <div style={{ padding: 16 }}>
          {/* <Box>
              
              <RadioGroup
                sx={{ display: 'flex', flexDirection: "row" }}
                aria-label="Gender"
                name="gender1"
                value={period.type}
                onChange={(e) => {
                  onChangeProductFilter(
                    {
                      type: e.target.value,
                      dateTo: period.dateTo,
                      dateFrom: period.dateFrom,
                    },
                    'period',
                  )
                }}
              >
                <FormControlLabel
                  value="All"
                  control={
                    <Radio
                      classes={{
                        root: classes.radio,
                        checked: classes.checked,
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <span
                      style={{
                        fontFamily: 'Open Sans',
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      All Period
                    </span>
                  }
                />

                <FormControlLabel
                  value="Date Range"
                  control={
                    <Radio
                      classes={{
                        root: classes.radio,
                        checked: classes.checked,
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <span
                      style={{
                        fontFamily: 'Open Sans',
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      Date Range
                    </span>
                  }
                />
              </RadioGroup> 
            </Box>*/}
          <Grid
            container
            spacing={3}
            style={{ paddingTop: 4, marginBottom: 16 }}
          >
            <Grid item xs={12}>
              {/* <DateField
                  label="From"
                  value={period.dateFrom}
                  change={(e) => {
                    onChangeProductFilter(
                      {
                        type: 'Date Range',
                        dateFrom: e,
                        dateTo: period.dateTo,
                      },
                      'period',
                    )
                  }}
                  disabled={period.type === 'All'}
                  required
                /> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['month']}
                  label="From"
                  value={period.dateFrom}
                  onChange={(e) => {
                    onChangeProductFilter(
                      {
                        type: 'Date Range',
                        dateFrom: e,
                        dateTo: period.dateTo,
                      },
                      'period',
                    )
                  }}
                  // disabled={period.type === 'All'}
                  required
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      required
                      // helperText="Please fill timeline start date"
                      variant="outlined"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              {/* <DateField
                  label="To"
                  value={period.dateTo}
                  change={(e) => {
                    onChangeProductFilter(
                      {
                        type: 'Date Range',
                        dateTo: e,
                        dateFrom: period.dateFrom,
                      },
                      'period',
                    )
                  }}
                  disabled={period.type === 'All'}
                  required
                /> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['month']}
                  label="To"
                  value={period.dateTo}
                  onChange={(e) => {
                    onChangeProductFilter(
                      {
                        type: 'Date Range',
                        dateTo: e,
                        dateFrom: period.dateFrom,
                      },
                      'period',
                    )
                  }}
                  // disabled={period.type === 'All'}
                  required
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      required
                      // helperText="Please fill timeline start date"
                      variant="outlined"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </div>
        {/* </DropdownPopover> */}
        {/* <DropdownPopover title="Sort By" pl={roleAdmin ? 24 : 0} pr={24}> */}
        <div style={{ padding: 16, width: 250 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <RadioGroup
              aria-label="sortby"
              name="sortby"
              value={sortBy}
              onChange={(e) => {
                onChangeProductFilter(e.target.value, 'sort')
              }}
            >
              <FormControlLabel
                value="asc"
                control={
                  <Radio
                    classes={{
                      root: classes.radio,
                      checked: classes.checked,
                    }}
                    color="primary"
                  />
                }
                label={
                  <span
                    style={{
                      // fontFamily: 'Open Sans',
                      fontWeight: 400,
                      fontSize: 12,
                    }}
                  >
                    Start Date (Ascending)
                  </span>
                }
              />

              <FormControlLabel
                value="desc"
                control={
                  <Radio
                    classes={{
                      root: classes.radio,
                      checked: classes.checked,
                    }}
                    color="primary"
                  />
                }
                label={
                  <span
                    style={{
                      // fontFamily: 'Open Sans',
                      fontWeight: 400,
                      fontSize: 12,
                    }}
                  >
                    Start Date (Descending)
                  </span>
                }
              />
            </RadioGroup>
          </Box>
        </div>
        {/* </DropdownPopover> */}
        <CssTextField
          id="search-projects"
          value={props.search}
          onChange={props.onChange}
          variant="standard"
          label="Search"
          sx={{ width: '100px', marginTop: 2 }}
          // sx={{
          //   display: 'flex', color: 'black', border: '1px solid #2064A4',
          //   paddingLeft: 0,
          //   paddingRight: 0,
          //   borderRight: props?.borderRight ? 'solid 1px rgb(227, 118, 118)' : 0,
          //   borderLeft: props?.borderLeft ? 'solid 1px rgb(227, 118, 118)' : 0,
          // }}
        />

        {/* <DropdownPopover title="User" pl={24} borderLeft>
          <div style={{ padding: 16, width: 340, maxHeight: 470 }}>
            <div className="dt-search-container" style={{ width: '100%' }}>
              <input
                onChange={(e) =>
                  setUser({
                    ...user,
                    search: e.target.value,
                  })
                }
                className="form-control form-control-sm dt-search"
                type="text"
                placeholder="Search"
                value={user.search}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <FormGroup>
                {userData.map((data) => {
                  return (
                    <FormControlLabel
                      key={`${data.role}-${data.id}`}
                      control={
                        <Checkbox
                          color="default"
                          checked={user.filter.includes(data.name)}
                          onChange={() => {
                            onChangeProductFilter(
                              {
                                ...data,
                                checked: !user.filter.includes(data.name),
                              },
                              'user',
                            )
                          }}
                          name={data.name}
                        />
                      }
                      label={data.name}
                    />
                  )
                })}
              </FormGroup>

              {!userData.length && <div className="mt-2">No user found.</div>}

              <ContentLoading height={470} loading={user.loading} />
            </div>
          </div>
        </DropdownPopover> */}
      </Box>

      {filterCard.length ? (
        <Box sx={{ textAlign: 'left', paddingTop: 2 }}>
          <Box sx={{ float: 'unset' }}>
            <Box>
              <span>{props.totalData}</span> Project(s) Found
            </Box>
            <Box sx={{ display: 'flex' }}>
              {filterCard.map((filter) => {
                return (
                  <Box key={`${filter.label}-${filter.type}`}>
                    {filter.label}
                    <span>
                      <Button
                        onClick={() => {
                          removeFilterCard(filter)
                        }}
                      >
                        X
                      </Button>
                    </span>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

const ProjectList = (props) => {
  const { boards, loading, error } = useSelector((state) => state.boards)
  const { token, isValid, user } = useSelector((state) => state.user)
  const { companies } = useSelector((state) => state.company)
  const [search, setSearch] = useState('')
  const [foundBoards, setFoundBoards] = useState(boards)
  const [openAlert, setOpenAlert] = useState(false)
  const [boardsWithFilter, setBoardsWithFilter] = useState([])
  const [filterCardState, setFilterCardState] = useState({})
  const [page, setPage] = React.useState(1)
  const { state } = useLocation()
  const handleChange = (event, value) => {
    setPage(value)
  }
  const dispatch = useDispatch()
  console.log('project dashboard state: ', state)
  useEffect(() => {
    // if (isValid) {
    dispatch(fetchAllBoards(token))
    dispatch(fetchAllCompaniesInfo(token))
    // }
  }, [token, isValid, dispatch, state])

  useEffect(() => {
    state && setOpenAlert(true)
  }, [state])

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  let userPartOfCompany = []
  let companyFromUser = ''
  userPartOfCompany = _.filter(companies, { companyTeam: [user.id] })
  companyFromUser = userPartOfCompany[0]?._id
  const mappedBoardsForUser = foundBoards.filter(
    (board) => board.company === companyFromUser,
  )
  const mappedBoardsForClient = foundBoards.filter((board) =>
    board.pic.includes(user.id),
  )
  // const mappedBoardsForClient = _.filter(boards, { pic: [companyFromUser]})
  //   (board) => board.pic.includes(companyFromUser)
  // )

  console.group('projectList')
  console.log('user:', user)
  console.log('companies:', companies)
  console.log('boards:', boards)
  console.log('userPartOfCompany', userPartOfCompany)
  console.log('companyFromUser', companyFromUser)
  console.log('mappedBoardsForUser', mappedBoardsForUser)
  console.log('mappedBoardsForClient', mappedBoardsForClient)
  console.log('foundBoards:', foundBoards)
  console.groupEnd('projectList')

  console.log('filterCardState:', filterCardState)
  useEffect(() => {
    const manipulatedResult = boards.filter((data) => {
      if (filterCardState?.merchantFilter?.length > 0) {
        const filtered = filterCardState.merchantFilter.some((f) => {
          return data.status.includes(f.value)
        })
        console.log('return filtered', filtered)
        return filtered
      } else return true
    })
    // setFoundBoards(results)
    console.log('manipulatedResult', manipulatedResult)
    const manipulatedResultWithPeriod = manipulatedResult.filter((data) => {
      if (
        filterCardState?.period?.dateFrom &&
        filterCardState?.period?.dateTo
      ) {
        console.log('filterCardState.period', filterCardState.period)
        console.log('data.startDate', moment(data.startDate).startOf('day'))
        console.log('data.endDate', moment(data.endDate).startOf('day'))
        console.log(
          'filterCardState.period.dateFrom',
          moment(filterCardState.period.dateFrom).startOf('day'),
        )
        console.log(
          'filterCardState.period.dateTo',
          moment(filterCardState.period.dateTo).startOf('day'),
        )
        const sameOrAfter = moment(data.startDate)
          .startOf('day')
          .isSameOrAfter(moment(filterCardState.period.dateFrom).startOf('day'))
        const sameOrBefore = moment(data.endDate)
          .startOf('day')
          .isSameOrBefore(moment(filterCardState.period.dateTo).startOf('day'))
        console.log({ sameOrAfter, sameOrBefore })
        // const filtered = filterCardState.merchantFilter.some((f) => {
        //   return data.status.includes(f.value) && moment(data.startDate) >= filterCardState.period.dateFrom  && data.endDate <= filterCardState.period.dateTo
        // })
        // return filtered
        // return (sameOrAfter && sameOrBefore)
        console.log('return period filter:', sameOrAfter && sameOrBefore)
        return sameOrAfter && sameOrBefore
      } else return true
    })
    console.log('manipulatedResultWithPeriod', manipulatedResultWithPeriod)
    setFoundBoards(manipulatedResultWithPeriod)
    setBoardsWithFilter(manipulatedResultWithPeriod)
  }, [filterCardState])
  const filter = (e) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = boardsWithFilter.length
        ? boardsWithFilter.filter((board) => {
            return board.projectName
              .toLowerCase()
              .startsWith(keyword.toLowerCase())
            // Use the toLowerCase() method to make it case-insensitive
          })
        : boards.filter((board) => {
            return board.projectName
              .toLowerCase()
              .startsWith(keyword.toLowerCase())
            // Use the toLowerCase() method to make it case-insensitive
          })
      setFoundBoards(results)
    } else {
      boardsWithFilter.length
        ? setFoundBoards(boardsWithFilter)
        : setFoundBoards(boards)
    }

    setSearch(keyword)
  }

  // const filteredBoardsByCompany = []
  // filteredBoardsByCompany = boards.filter(board=>{
  //   return board.
  // })
  const paginateGood = (array, page_size, page_number) => {
    return array.slice(
      page_number * page_size,
      page_number * page_size + page_size,
    )
  }
  const getFilterData = (data) => {
    console.log('getFilterData:', data)
    setFilterCardState(data)
  }
  const sortedFoundBoards = (boardsFromRole, sortBy = 'asc') => {
    console.log('foundboards inside sorted function', boardsFromRole, sortBy)
    if (sortBy === 'asc') {
      return boardsFromRole.sort(
        (a, b) =>
          moment(b.startDate).format('YYYYMMDD') -
          moment(a.startDate).format('YYYYMMDD'),
      )
    } else {
      return boardsFromRole.sort(
        (a, b) =>
          moment(a.startDate).format('YYYYMMDD') -
          moment(b.startDate).format('YYYYMMDD'),
      )
    }
  }

  const filterBoardsBasedByRole = (role) => {
    console.log('user role ', role)
    switch (role) {
      case 'ADMIN':
        return (
          foundBoards &&
          foundBoards.length > 0 &&
          paginateGood(
            sortedFoundBoards(foundBoards, filterCardState?.sortBy),
            9,
            page - 1,
          ).map((board) => (
            <Grid item key={board.id} lg={4} md={6} xs={12}>
              <ProjectCard board={board} />
            </Grid>
          ))
        )
      case 'MEMBER':
        return (
          foundBoards &&
          foundBoards.length > 0 &&
          paginateGood(
            sortedFoundBoards(foundBoards, filterCardState?.sortBy),
            9,
            page - 1,
          ).map((board) => (
            <Grid item key={board.id} lg={4} md={6} xs={12}>
              <ProjectCard board={board} />
            </Grid>
          ))
        )
      // case 'USER':
      //   return mappedBoardsForUser && mappedBoardsForUser.length > 0 && (
      //     paginateGood(sortedFoundBoards(mappedBoardsForUser, filterCardState?.sortBy), 9, page - 1).map((board) => (
      //       <Grid item key={board.id} lg={4} md={6} xs={12}>
      //         <ProjectCard board={board} />
      //       </Grid>
      //     )));
      case 'CLIENT':
        return (
          mappedBoardsForClient &&
          mappedBoardsForClient.length > 0 &&
          paginateGood(
            sortedFoundBoards(mappedBoardsForClient, filterCardState?.sortBy),
            9,
            page - 1,
          ).map((board) => (
            <Grid item key={board.id} lg={4} md={6} xs={12}>
              <ProjectCard board={board} />
            </Grid>
          ))
        )
      default:
        return (
          <Grid item lg={4} md={6} xs={12}>
            <p>No boards found</p>
          </Grid>
        )
    }
  }

  const theme = useTheme()
  const changeFlow = useMediaQuery(theme.breakpoints.up('sm'))
  console.log('changeFlow', changeFlow)
  return (
    <>
      <Helmet>
        <title>Projects | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          <Box
            sx={{ display: 'flex', flexFlow: changeFlow ? 'row' : 'row wrap' }}
          >
            {/* <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginTop: 5,
                width: '100%',
              }}
            > */}
            <ProjectFilters
              data={statusOptions}
              getFilterData={(data) => getFilterData(data)}
              search={search}
              onChange={filter}
            />
            {/* </Box> */}
            <Container maxWidth={false}>
              {user.role === 'ADMIN' && <ProjectListToolbar />}
              <Box sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {filterBoardsBasedByRole(user.role)}
                </Grid>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Pagination
                    count={
                      user.role === 'ADMIN'
                        ? Math.ceil(foundBoards.length / 9)
                        : Math.ceil(mappedBoardsForUser.length / 9)
                    }
                    color="primary"
                    page={page}
                    onChange={handleChange}
                    sx={{ marginTop: 10 }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  pt: 3,
                }}
              >
                {/* <Pagination color="primary" count={3} size="small" /> */}
              </Box>
              <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
              >
                <Alert
                  onClose={handleCloseAlert}
                  severity={state?.status === 'error' ? 'error' : 'success'}
                  sx={{ width: '100%' }}
                >
                  {`${state?.message}`}
                </Alert>
              </Snackbar>
            </Container>
          </Box>
        )}
      </Box>
    </>
  )
}

export default ProjectList
