'use strict'

import React, { Component } from 'react'
import { Grid, Icon, Header } from 'semantic-ui-react'
import { HashRouter as Router, NavLink } from 'react-router-dom'
import PetalRoutes from '../../routes'

import './index.scss'

class Container extends Component {

  render() {

    return (
      <Router>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2} id='sidebarColumn'>
              <ul className='navigation'>
                <li>
                  <NavLink exact to='/' activeClassName='selected'>
                    <Icon name='leaf' size='large' color='grey' />
                    <span>I'mFM</span>
                  </NavLink>
                </li>
                <li>
                  <Icon name='book' size='large' color='grey' />
                  <span>Book</span>
                </li>
                <li>
                  <Icon name='video' size='large' color='grey' />
                  <span>Movie</span>
                </li>
                <li>
                  <Icon name='music' size='large' color='grey' />
                  <span>Music</span>
                </li>
                <li>
                  <Icon name='users' size='large' color='grey' />
                  <span>City</span>
                </li>
                <li id='logIn'>
                  <NavLink to='/login' activeClassName='selected'>
                    <Icon name='user circle' size='large' color='grey' />
                    <span>Login</span>
                  </NavLink>
                </li>
              </ul>
            </Grid.Column>
            <Grid.Column width={14}>
              {PetalRoutes}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Router>
    )
  }
}

export default Container