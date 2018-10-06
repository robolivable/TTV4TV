import React from 'react'

import { Focusable } from 'react-key-navigation'

export default class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    this._handleSearchOnBlur = this._handleSearchOnBlur.bind(this)
    this._handleSearchOnEnterDown = this._handleSearchOnEnterDown.bind(this)
    this._handleSearchOnFocus = this._handleSearchOnFocus.bind(this)

    this.state = {
      activeFocus: false
    }
  }

  render () {
    return (
      <Focusable
        onFocus={this._handleSearchOnFocus}
        onBlur={this._handleSearchOnBlur}
        onEnterDown={this._handleSearchOnEnterDown}
        navDefault
      >
        <div
          className={this.state.activeFocus ?
            'search-box-placeholder-focus'
          : ''}
          id='search-box-placeholder'
        >
          <i className='fa fa-search' />
        </div>
      </Focusable>
    )    
  }

  _handleSearchOnBlur () {
    this.setState({ activeFocus: false })
  }

  _handleSearchOnEnterDown (e, navigation) {
    console.log(e, navigation)
  }

  _handleSearchOnFocus () {
    this.setState({ activeFocus: true })
  }
}
