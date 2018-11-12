import config from '../config'
import React from 'react'
import { Focusable } from 'react-key-navigation'

export default class SearchBar extends React.Component {
  constructor (...args) {
    super(...args)
    this._handleSearchOnBlur = this._handleSearchOnBlur.bind(this)
    this._handleSearchOnEnterDown = this._handleSearchOnEnterDown.bind(this)
    this._handleSearchOnFocus = this._handleSearchOnFocus.bind(this)
    this.searchBarInputRef = null

    this.state = {
      activeFocus: false
    }
  }

  render () {
    return (
      <div className='content'
        style={{ 'margin-top': this.props.visible ? '0px' : '-70px' }}
      >
        <div className={`contentgroup${this.props.visible ? '' : ' fading-out'}`}>
          <Focusable
            onFocus={this._handleSearchOnFocus}
            onBlur={this._handleSearchOnBlur}
            onEnterDown={this.props.onEnterDown(this._handleSearchOnEnterDown)}
            navDefault
          >
            <div className={
              `search-box-placeholder${this.state.activeFocus ? ' focus' : ''}`
            }>
              <i className='fa fa-search' />
              <input
                id='search-bar-input'
                ref={element => { this.searchBarInputRef = element }}
                type='text'
                value={this.state.searchValue}
                style={this.state.activeFocus ? { backgroundColor: 'white' } : {}}
                onKeyDown={`(e => {
                  sessionStorage.setItem(
                    '${config.SESSION_SEARCH_BAR_INPUT_VALUE}',
                    e.target.value
                  )
                })(event)`}
              />
            </div>
          </Focusable>
        </div>
      </div>
    )
  }

  _handleSearchOnBlur () {
    this.setState({ activeFocus: false })
  }

  _handleSearchOnEnterDown (e, navigation) {
    this.searchBarInputRef.focus()
  }

  _handleSearchOnFocus () {
    this.setState({ activeFocus: true })
  }
}
