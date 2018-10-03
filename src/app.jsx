import config from './config'
import React from 'react'
import ReactTV from 'react-tv'
import Twitch from './clients/twitch'

import Navigation, {
  Focusable,
  HorizontalList,
  VerticalList
} from 'react-key-navigation'

class TwitchMedia extends React.Component {
  constructor (props) {
    super(props)
    this._handleFocusableOnFocus = this._handleFocusableOnFocus.bind(this)
    this._handleFocusableOnBlur = this._handleFocusableOnBlur.bind(this)
    this.state = { active: false }
  }

  render () {
    return (
      <Focusable
        onFocus={this._handleFocusableOnFocus}
        onBlur={this._handleFocusableOnBlur}
      >
        <div
          className={`item${(this.state.active && ' item-focus') || ''}`}
          style={{
            backgroundImage: `url("${this.props.previewUrl}")`,
            backgroundSize: 'cover',
          }}
        >
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

class List extends React.Component {
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
        <div id='content' ref={content => {this.content = content}}>
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

class Search extends React.Component {}

class Sidebar extends React.Component {}

class TwitchPlayer extends React.Component {
  componentDidUpdate () {
    (new window.Twitch.Player(
      config.TWITCH_PLAYER_ID,
      Object.assign({
        width: config.PLAYER_INIT_WIDTH,
        height: config.PLAYER_INIT_HEIGHT
      }, this.props)
    )).setVolume(config.PLAYER_INIT_VOLUME)
  }

  render () {
    return <div id={config.TWITCH_PLAYER_ID}></div>
  }
}

class TTV4TV extends React.Component {
  constructor (props) {
    super(props)
    this._handleMediaClick = this._handleMediaClick.bind(this)
    this._handleListOnFocus = this._handleListOnFocus.bind(this)
    this._handleVerticalListOnBlur = this._handleVerticalListOnBlur.bind(this)
    this._handleTwitchPlayerOnClose = this._handleTwitchPlayerOnClose.bind(this)
    this.state = {
      activeFocus: null,
      isMediaPlayerEnabled: false,
      media: null,
      fetched: false,
      subscribed: [],
      following: [],
      streams: [],
      topGames: [],
      lists: []
    }
    this.twitch = new Twitch()
  }

  async componentDidMount () {
    if (this.state.fetched) {
      return
    }

    const lists = await Promise.all([
      //async () => ({ name: 'subscribed', val: await this.twitch.subscribed()}),
      (async () => {
        const val = await this.twitch.subscribed()
        return { name: 'subsriptions', namePretty: 'Subscriptions', val }
      })(),
      (async () => {
        const val = await this.twitch.following()
        return { name: 'following', namePretty: 'Following', val }
      })(),
      (async () => {
        const val = await this.twitch.topGames()
        return { name: 'topGames', namePretty: 'Top Games', val }
      })(),
      (async () => {
        const val = await this.twitch.streams()
        return { name: 'streams', namePretty: 'Live Streams', val }
      })(),
    ])

    this.setState({
      fetched: true,
      subscribed: lists[0].val,
      following: lists[1].val,
      topGames: lists[2].val,
      streams: lists[3].val,
      lists
    })
  }

  render() {
    return (
      <Navigation>
        <div id="container">
          {this.state.isMediaPlayerEnabled ? () => {
            switch (this.state.media.type) {
              case 'collection':
                return (
                  <TwitchPlayer
                    onClose={this._handleTwitchPlayerOnClose}
                    collection={this.state.media.id}
                  />
                )
              case 'video':
                return (
                  <TwitchPlayer
                    onClose={this._handleTwitchPlayerOnClose}
                    video={this.state.media.id}
                  />
                )
              case 'channel':
              default:
                return (
                  <TwitchPlayer
                    onClose={this._handleTwitchPlayerOnClose}
                    channel={this.state.media.id}
                  />
                )
            }
          } : null}
          <HorizontalList>
            {/*<Sidebar/> TODO*/}
            <div className="mainbox">
              <VerticalList navDefault>
                {/*<Search/> TODO*/}
                <VerticalList
                  className='content'
                  onBlur={this._handleVerticalListOnBlur}
                >
                  {this.state.lists.map((list, key) =>
                    <List
                      key={key}
                      title={list.namePretty}
                      name={list.name}
                      medias={list.val || []}
                      onFocus={this._handleListOnFocus(key)}
                      visible={!!list.val && !!list.val.length &&
                               (this.state.activeFocus === null ||
                               key >= this.state.activeFocus)}
                      onMediaClick={this._handleMediaClick}
                    />
                  )}
                </VerticalList>
              </VerticalList>
            </div>
          </HorizontalList>
        </div>
      </Navigation>
    )
  }

  _handleMediaClick (type, id) {
    if (!type) {
      return
    }
    return () => this.setState({
      isMediaPlayerEnabled: true,
      media: { type, id }
    })
  }

  _handleListOnFocus (activeFocus) {
    return () => this.setState({ activeFocus })
  }

  _handleVerticalListOnBlur () {
    this.setState({ activeFocus: null })
  }

  _handleTwitchPlayerOnClose () {
    this.setState({ isMediaPlayerEnabled: false, media: null })
  }
}

ReactTV.render(<TTV4TV />, document.querySelector('#root'))
