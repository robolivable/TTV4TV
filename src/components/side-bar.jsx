/* eslint-disable operator-linebreak */
import config from '../config'
import React from 'react'

import { Focusable, VerticalList } from 'react-key-navigation'

class SideBarButton extends React.Component {
  constructor (props) {
    super(props)

    this._handleSideBarButtonOnFocus =
      this._handleSideBarButtonOnFocus.bind(this)
    this._handleSideBarButtonOnBlur = this._handleSideBarButtonOnBlur.bind(this)

    this.state = {
      activeFocus: false
    }
  }

  render () {
    return (
      <Focusable
        onFocus={this._handleSideBarButtonOnFocus}
        onBlur={this._handleSideBarButtonOnBlur}
        onClick={this.props.onClick}
      >
        <div className={`item${this.state.activeFocus ? ' item-focus' : ''}`}>
          <i className={`fa fa-${this.props.icon}`} />
          {this.props.children}
        </div>
      </Focusable>
    )
  }

  _handleSideBarButtonOnFocus () {
    this.setState({ activeFocus: true })
  }

  _handleSideBarButtonOnBlur () {
    this.setState({ activeFocus: false })
  }
}

export default class SideBar extends React.Component {
  constructor (props) {
    super(props)

    this._handleVirticalListOnFocus = this._handleVirticalListOnFocus.bind(this)
    this._handleVirticalListOnBlur = this._handleVirticalListOnBlur.bind(this)

    this.state = {
      activeFocus: false
    }
  }

  render () {
    return (
      <div className={`sidebar${this.state.activeFocus ? ' focused' : ''}`}>
        <div className='icons'>
          <div><span className='fa fa-user' /></div>
          <div><span className='fa fa-home' /></div>
          <div><span className='fa fa-gamepad' /></div>
          <div><span className='fa fa-ellipsis-v' /></div>
        </div>
        <div className='menu'>
          <VerticalList
            onFocus={this._handleVirticalListOnFocus}
            onBlur={this._handleVirticalListOnBlur}
            focusId='sidebar'
            retainLastFocus
          >
            <SideBarButton
              icon='user'
              onClick={this._handleSideBarButtonOnClick(
                config.NAVIGATION_LOGIN
              )}
            >
              {this.props.isLoggedIn() ? 'Switch Users' : 'Login'}
            </SideBarButton>
            <SideBarButton
              icon='home'
              onClick={this._handleSideBarButtonOnClick(
                config.NAVIGATION_HOME
              )}
            >
              Home
            </SideBarButton>
            <SideBarButton
              icon='gamepad'
              onClick={this._handleSideBarButtonOnClick(
                config.NAVIGATION_GAMES
              )}
            >
              Browse Games
            </SideBarButton>
            <SideBarButton
              icon='film'
              onClick={this._handleSideBarButtonOnClick(
                config.NAVIGATION_STREAMS
              )}
            >
              Browse Streams
            </SideBarButton>
            {this.props.isLoggedIn() ? <SideBarButton
              icon='heart'
              onClick={this._handleSideBarButtonOnClick(
                config.NAVIGATION_CHANNELS_FOLLOWING
              )}
            >
              Following
            </SideBarButton> : null}
          </VerticalList>
        </div>
      </div>
    )
  }

  _handleSideBarButtonOnClick (navigation) {
    return () => {
      console.log('sidebar navigation ==>', navigation)
      this.props.setNavigation(navigation)
    }
  }

  _handleVirticalListOnFocus () {
    this.setState({ activeFocus: true })
  }

  _handleVirticalListOnBlur () {
    this.setState({ activeFocus: false })
  }
}
