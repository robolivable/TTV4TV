import config from '../config'
import React from 'react'
import TwitchMedia from './twitch-media'

import { HorizontalList } from 'react-key-navigation'

export default class List extends React.Component {
  constructor (props) {
    super(props)
    this._handleHorizontalListOnFocus =
      this._handleHorizontalListOnFocus.bind(this)
    this._handleHorizontalListOnBlur =
      this._handleHorizontalListOnBlur.bind(this)
    this._lastFocus = null
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
    const hzListElements = this.content.getElementsByClassName('hz-list')
    if (!width || !hzListElements[0]) {
      return
    }
    hzListElements[0].style.width = `${width}px`
  }

  render () {
    return (
      <div className={`contentgroup${this.props.visible ? '' : ' fading-out'}`}>
        <h1>{this.props.title}</h1>
        <div id='content' ref={content => { this.content = content }}>
          <HorizontalList
            className='hz-list'
            style={{ overflow: 'hidden', display: 'block' }}
            onFocus={this._handleHorizontalListOnFocus}
            onBlur={this._handleHorizontalListOnBlur}
          >
            {this.props.medias.map((media, key) => {
              const { id, previewUrl } = List.mediaPropsByType(
                this.props.name,
                media
              )
              return (
                <TwitchMedia
                  key={key}
                  previewUrl={previewUrl}
                  onClick={this.props.onMediaClick(
                    config.MEDIA_PLAYER_TYPES[this.props.title],
                    id
                  )}
                />
              )
            })}
          </HorizontalList>
        </div>
      </div>
    )
  }

  _handleHorizontalListOnFocus (index) {
    if (this._lastFocus === index) {
      return
    }

    if (this.props.onFocus) {
      this.props.onFocus()
    }

    if (this.content) {
      const items = this.content.getElementsByClassName('item')
      if (!items.length) {
        return
      }
      const offsetWidth = items[0].offsetWidth + 20
      this.content.scrollLeft = offsetWidth * index
    }

    this._lastFocus = index
  }

  _handleHorizontalListOnBlur () {
    this._lastFocus = null
  }

  static mediaPropsByType (type, item) {
    switch (type) {
      case 'subscribed':
        return {
          id: item.get('channel')._id,
          previewUrl: item.get('channel').logo
        }
      case 'followed':
        return {
          id: item.get('channel')._id,
          previewUrl: item.get('channel').logo
        }
      case 'topGames':
        return {
          id: item.get('game')._id,
          previewUrl: item.get('game').box.large
        }
      case 'streams':
        return {
          id: item.get('channel')._id,
          previewUrl: item.get('preview').medium
        }
      default:
        return {}
    }
  }
}
