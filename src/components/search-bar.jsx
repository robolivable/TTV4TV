/*
 * The MIT License (MIT) Copyright (c) 2018 Robert Oliveira
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
