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

import React from 'react'

import { Focusable } from 'react-key-navigation'

export default class TwitchMedia extends React.Component {
  constructor (...args) {
    super(...args)
    this._handleFocusableOnFocus = this._handleFocusableOnFocus.bind(this)
    this._handleFocusableOnBlur = this._handleFocusableOnBlur.bind(this)
    this.state = { active: false }
  }

  render () {
    const className = `${this.props.className} ` +
                      `item${(this.state.active && ' item-focus') || ''}`
    return (
      <Focusable
        onFocus={this.props.onMediaItemFocus(
          this._handleFocusableOnFocus,
          this.mediaItem,
          this.props.focusStruct
        )}
        onBlur={this._handleFocusableOnBlur}
      >
        <div
          ref={mediaItem => { this.mediaItem = mediaItem }}
          className={className}
          onClick={this.props.onMediaClick}
          style={{
            backgroundImage: `url("${this.props.previewUrl}")`,
            backgroundSize: 'cover',
            color: 'white'
          }}
        >
          <div className='twitch-media-copy'>
            <div className='twitch-media-name'>
              {this.props.name}
            </div>
            <div className='twitch-media-statusText'>
              {this.props.statusText}
            </div>
            <div className='twitch-media-gameTitle'>
              {this.props.gameTitle}
            </div>
            <div className='twitch-media-viewCount'>
              {new Intl.NumberFormat('en').format(this.props.viewCount)}
              {this.props.className === 'channels' ? ' followers' : ' viewers'}
            </div>
          </div>
        </div>
      </Focusable>
    )
  }

  _handleFocusableOnFocus () {
    this.setState({ active: true })
  }

  _handleFocusableOnBlur () {
    this.setState({ active: false })
  }
}
