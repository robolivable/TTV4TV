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
import utils from '../utils'
import React from 'react'
import TwitchMedia from './twitch-media'

import { Grid, HorizontalList } from 'react-key-navigation'

const FOCUSABLE_GRID = 'grid'
const FOCUSABLE_LIST = 'hzlist'

class MediaGridContainer extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      medias: this.props.medias
    }
  }

  async fetchMedias () {
    if (this.props.disablePagination) {
      return
    }
    await this.props.medias.fetch()
    this.setState({ medias: this.props.medias })
  }

  render () {
    const columns = Math.floor(
      window.innerWidth / (this.props.dims[0] + this.props.mediaMargin)
    )
    const rows = Math.ceil(this.state.medias.length / columns)
    return (
      <Grid
        rows={rows}
        columns={columns}
        onFocus={this.props._handleMediaOnFocus}
        onBlur={this.props._handleMediaOnBlur}
        gridScroll={this.props.gridScroll}
      >
        {this.state.medias.map((media, key) => {
          const {
            id,
            gameTitle,
            name,
            previewUrl,
            statusText,
            viewCount
          } = utils.mediaPropsByType(this.props.name, media)
          return (
            <TwitchMedia
              className={this.props.name}
              key={key}
              focusStruct={{ columns, rows, key }}
              gameTitle={gameTitle}
              name={name}
              previewUrl={previewUrl}
              statusText={statusText}
              viewCount={viewCount}
              onMediaClick={this.props.onMediaClick(
                config.MEDIA_PLAYER_TYPES[this.props.name],
                id
              )}
              onMediaItemFocus={this.props.onMediaItemFocus(this)}
            />
          )
        })}
      </Grid>
    )
  }
}

class MediaListContainer extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      medias: this.props.medias
    }
  }

  async fetchMedias () {
    if (this.props.disablePagination) {
      return
    }
    await this.props.medias.fetch()
    this.setState({ medias: this.props.medias })
  }

  render () {
    return (
      <HorizontalList
        className={`${this.props.name} hz-list`}
        style={{ display: 'block' }}
        onFocus={this.props._handleMediaOnFocus}
        onBlur={this.props._handleMediaOnBlur}
      >
        {this.state.medias.map((media, key) => {
          const {
            id,
            gameTitle,
            previewUrl,
            viewCount
          } = utils.mediaPropsByType(this.props.name, media)
          return (
            <TwitchMedia
              className={this.props.name}
              key={key}
              gameTitle={gameTitle}
              previewUrl={previewUrl}
              viewCount={viewCount}
              onMediaClick={this.props.onMediaClick(
                config.MEDIA_PLAYER_TYPES[this.props.name],
                id
              )}
              onMediaItemFocus={this.props.onMediaItemFocus(this)}
            />
          )
        })}
      </HorizontalList>
    )
  }
}

export default class MediaContent extends React.Component {
  constructor (...args) {
    super(...args)
    this.onMediaItemFocus = this.onMediaItemFocus.bind(this)
    this._handleListMediaOnFocus = this._handleListMediaOnFocus.bind(this)
    this._handleListMediaOnBlur = this._handleListMediaOnBlur.bind(this)
    this._handleGridMediaOnFocus = this._handleGridMediaOnFocus.bind(this)
    this._handleGridMediaOnBlur = this._handleGridMediaOnBlur.bind(this)
    this._lastFocus = null
    this._setStateCallback = this._setStateCallback.bind(this)
    this.state = {
      gridScroll: 0
    }
  }

  componentDidMount () {
    if (!this.content) {
      return
    }
    const width = (
      Math.floor(
        this.content.scrollWidth /
        this.content.clientWidth
      ) * this.content.clientWidth
    ) + this.content.clientWidth + 20
    const hzListElements = this.content.getElementsByClassName(
      `${this.props.name} hz-list`
    )
    if (Number.isNaN(width) || !hzListElements.length) {
      return
    }
    hzListElements[0].style.width = `${width}px`
  }

  render () {
    return (
      <div className={`contentgroup${this.props.visible ? '' : ' fading-out'}`}>
        <div className='content-header'>
          <h1 className='content-title'>{this.props.title}</h1>
          <h4 className='content-caption'>{this.props.caption}</h4>
        </div>
        <div className='medias' ref={content => { this.content = content }}>
          {(() => {
            switch (this.props.type) {
              case (FOCUSABLE_LIST):
                return (
                  <MediaListContainer
                    _handleMediaOnFocus={this._handleListMediaOnFocus}
                    _handleMediaOnBlur={this._handleListMediaOnBlur}
                    onMediaItemFocus={this.onMediaItemFocus}
                    {...this.props}
                  />
                )
              case (FOCUSABLE_GRID):
                return (
                  <MediaGridContainer
                    _handleMediaOnFocus={this._handleGridMediaOnFocus}
                    _handleMediaOnBlur={this._handleGridMediaOnBlur}
                    onMediaItemFocus={this.onMediaItemFocus}
                    gridScroll={this.state.gridScroll}
                    {...this.props}
                  />
                )
              default:
                return null
            }
          })()}
        </div>
      </div>
    )
  }

  // Grid scrolling is made possible in this method
  onMediaItemFocus (component) {
    return (wrappedFunc, element, focusStruct) => (...args) => {
      if (!focusStruct ||
          !Number.isInteger(focusStruct.key) ||
          !utils.isDOMElement(element)) {
        return wrappedFunc(...args)
      }

      const currentRow = Math.ceil(
        (focusStruct.key + 1) / focusStruct.columns
      )
      if (currentRow <= this.state.gridScroll) {
        this.setState(
          { gridScroll: currentRow - 1 },
          this._setStateCallback
        )
      }

      const offsetTop = element.offsetTop
      const windowHeight = window.innerHeight
      const fullOffsetTop = offsetTop + element.clientHeight
      const elementFitsInWindow = fullOffsetTop < windowHeight
      if (currentRow === focusStruct.rows - 2) {
        // TODO: HACK FIXME, we load two rows before the last to avoid getting
        // a null react ref here (for `element`)
        component.fetchMedias() // fire & forget
      }
      if (elementFitsInWindow) {
        return wrappedFunc(...args)
      }

      const deltaHeight = fullOffsetTop - windowHeight
      const rowsToCloak = Math.ceil(deltaHeight / element.clientHeight)

      this.setState(
        { gridScroll: this.state.gridScroll + rowsToCloak },
        this._setStateCallback
      )

      return wrappedFunc(...args)
    }
  }

  _setStateCallback () {
    this.props.setSearchBarIsVisible(!this.state.gridScroll)
  }

  // TODO: optimize focus logic to work with very large lists
  _handleListMediaOnFocus (index) {
    if (this._lastFocus === index) {
      return
    }

    if (this.props.onFocus) {
      this.props.onFocus()
    }

    if (this.content) {
      const items = this.content.getElementsByClassName(
        `${this.props.name} item`
      )
      if (!items.length) {
        return
      }
      const offsetWidth = items[0].offsetWidth + 20
      this.content.style.marginLeft = `${(offsetWidth * index * -1) - 50}px`
    }

    this._lastFocus = index
  }

  _handleListMediaOnBlur () {
    this._lastFocus = null
  }

  // TODO: optimize focus logic to work with very large lists
  _handleGridMediaOnFocus (index) {
    if (this._lastFocus === index) {
      return
    }

    if (this.props.onFocus) {
      this.props.onFocus()
    }

    this._lastFocus = index
  }

  _handleGridMediaOnBlur () {
    this._lastFocus = null
    this.setState({ gridScroll: 0 }, this._setStateCallback)
  }
}
