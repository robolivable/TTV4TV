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
          <HorizontalList
            className={`${this.props.name} hz-list`}
            style={{ display: 'block' }}
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
                  className={this.props.name}
                  key={key}
                  previewUrl={previewUrl}
                  onMediaClick={this.props.onMediaClick(
                    config.MEDIA_PLAYER_TYPES[this.props.name],
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

  _handleHorizontalListOnBlur () {
    this._lastFocus = null
  }

  static mediaPropsByType (type, item) {
    switch (type) {
      case 'subscribed':
        return {
          id: item.get('channel').display_name,
          previewUrl: item.get('channel').logo
        }
      case 'followed':
        return {
          id: item.get('channel').display_name,
          previewUrl: item.get('channel').logo
        }
      case 'topGames':
        return {
          id: item.get('game')._id,
          previewUrl: item.get('game').box.large
        }
      case 'streams':
        return {
          id: item.get('channel').display_name,
          previewUrl: item.get('preview').medium
        }
      default:
        return {}
    }
  }
}
