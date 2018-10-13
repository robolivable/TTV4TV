import config from '../config'
import utils from '../utils'
import React from 'react'
import TwitchMedia from './twitch-media'

import { Grid, HorizontalList } from 'react-key-navigation'

const FOCUSABLE_GRID = 'grid'
const FOCUSABLE_LIST = 'hzlist'

class MediaGridContainer extends React.Component {
  render () {
    const columns = Math.floor(
      window.innerWidth / (this.props.dims[0] + this.props.mediaMargin)
    )
    const rows = Math.ceil(this.props.medias.length / columns)
    return (
      <Grid
        rows={rows}
        columns={columns}
        onFocus={this.props._handleMediaOnFocus}
        onBlur={this.props._handleMediaOnBlur}
        gridScroll={this.props.gridScroll}
      >
        {this.props.medias.map((media, key) => {
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
              onMediaItemFocus={this.props.onMediaItemFocus}
            />
          )
        })}
      </Grid>
    )
  }
}

class MediaListContainer extends React.Component {
  render () {
    return (
      <HorizontalList
        className={`${this.props.name} hz-list`}
        style={{ display: 'block' }}
        onFocus={this.props._handleMediaOnFocus}
        onBlur={this.props._handleMediaOnBlur}
      >
        {this.props.medias.map((media, key) => {
          const { id, previewUrl, viewCount } = utils.mediaPropsByType(
            this.props.name,
            media
          )
          return (
            <TwitchMedia
              className={this.props.name}
              key={key}
              previewUrl={previewUrl}
              viewCount={viewCount}
              onMediaClick={this.props.onMediaClick(
                config.MEDIA_PLAYER_TYPES[this.props.name],
                id
              )}
              onMediaItemFocus={this.props.onMediaItemFocus}
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
  onMediaItemFocus (wrappedFunc, element, focusStruct) {
    return (...args) => {
      if (!focusStruct || !Number.isInteger(focusStruct.key)) {
        return wrappedFunc(...args)
      }

      const currentRow = Math.ceil((focusStruct.key + 1) / focusStruct.columns)
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
