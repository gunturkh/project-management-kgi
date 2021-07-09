import React from 'react'
import { Outlet } from 'react-router-dom'
import { experimentalStyled } from '@material-ui/core'

const BlankLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%',
}))

const BlankLayoutWrapper = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
})

const BlankLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
})

const BlankLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
})

const BlankLayout = () => (
  <BlankLayoutRoot>
    <BlankLayoutWrapper>
      <BlankLayoutContainer>
        <BlankLayoutContent>
          <Outlet />
        </BlankLayoutContent>
      </BlankLayoutContainer>
    </BlankLayoutWrapper>
  </BlankLayoutRoot>
)

export default BlankLayout
