import List from './list'
import React from 'react'
import SearchBar from './search-bar'
import SideBar from './side-bar'
import Twitch from '../clients/twitch'
import TwitchPlayer from './twitch-player'

import Navigation, {
  HorizontalList,
  VerticalList
} from 'react-key-navigation'

const CONTROLLER_BACK = 0x1CD
const CONTROLLER_BLUE = 0x196
const CONTROLLER_DOWN = 0x28
const CONTROLLER_GREEN = 0x194
const CONTROLLER_LEFT = 0x25
const CONTROLLER_OK = 0x0D
const CONTROLLER_RED = 0x193
const CONTROLLER_RIGHT = 0x27
const CONTROLLER_UP = 0x26
const CONTROLLER_YELLOW = 0x195

const KEYBOARD_ESCAPE = 0x1B

export default class TTV4TV extends React.Component {
  constructor (props) {
    super(props)
    this._handleMediaClick = this._handleMediaClick.bind(this)
    this._handleListOnFocus = this._handleListOnFocus.bind(this)
    this._handleVerticalListOnBlur = this._handleVerticalListOnBlur.bind(this)
    this._handleOnKeyDown = this._handleOnKeyDown.bind(this)
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

    document.addEventListener('keydown', this._handleOnKeyDown, false)

    const lists = await Promise.all([
      (async () => {
        const val = await this.twitch.subscribed()
        return {
          name: 'subsriptions',
          namePretty: 'Subscriptions',
          caption: 'Channels you are subscribed to',
          val
        }
      })(),
      (async () => {
        const val = await this.twitch.following()
        return {
          name: 'following',
          namePretty: 'Following',
          caption: 'Channels you follow',
          val
        }
      })(),
      (async () => {
        const val = await this.twitch.topGames()
        return {
          name: 'topGames',
          namePretty: 'Featured Games',
          caption: 'Games people are watching now',
          val
        }
      })(),
      (async () => {
        const val = await this.twitch.streams()
        return {
          name: 'streams',
          namePretty: 'Top Live Channels',
          caption: 'Broadcasters people are watching right now',
          val
        }
      })(),
      (async () => {
        const val = await this.twitch.ps4Streams()
        return {
          name: 'ps4Streams',
          namePretty: 'Top PS4 Channels',
          caption: 'Channels broadcasted from Playstation 4',
          val
        }
      })(),
      (async () => {
        const val = await this.twitch.xboxOneStreams()
        return {
          name: 'xboxOneStreams',
          namePretty: 'Top Xbox One Channels',
          caption: 'Channels broadcasted from Xbox One',
          val
        }
      })()
    ])

    this.setState({
      fetched: true,
      subscribed: lists[0].val,
      following: lists[1].val,
      topGames: lists[2].val,
      streams: lists[3].val,
      ps4Streams: lists[3].val,
      xboxOneStreams: lists[3].val,
      lists
    })
  }

  render () {
    return (
      <Navigation>
        <div className='container'>
          {this.state.isMediaPlayerEnabled ? (() => {
            switch (this.state.media.type) {
              case 'collection':
                return (
                  <TwitchPlayer
                    options={{ colletion: this.state.media.id }}
                  />
                )
              case 'video':
                return (
                  <TwitchPlayer
                    options={{ video: this.state.media.id }}
                  />
                )
              case 'channel':
              default:
                return (
                  <TwitchPlayer
                    options={{ channel: this.state.media.id }}
                  />
                )
            }
          })() : null}
          <HorizontalList>
            <SideBar />
            <div className='mainbox'>
              <VerticalList navDefault>
                <SearchBar />
                <VerticalList
                  className='content'
                  onBlur={this._handleVerticalListOnBlur}
                >
                  {this.state.lists.map((list, key) =>
                    <List
                      key={key}
                      title={list.namePretty}
                      caption={list.caption}
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
    return () => {
      if (!type) {
        return
      }
      if (type === 'game') {
        console.log('TODO: handle game')
        return
      }
      this.setState({
        isMediaPlayerEnabled: true,
        media: { type, id }
      })
    }
  }

  _handleListOnFocus (activeFocus) {
    return () => this.setState({ activeFocus })
  }

  _handleVerticalListOnBlur () {
    this.setState({ activeFocus: null })
  }

  _handleOnKeyDown (e) {
    switch (e.keyCode) {
      case (KEYBOARD_ESCAPE):
      case (CONTROLLER_BACK):
        e.preventDefault()
        e.stopPropagation()
        this.setState({ isMediaPlayerEnabled: false, media: null })
        break
      case (CONTROLLER_LEFT):
      case (CONTROLLER_UP):
      case (CONTROLLER_RIGHT):
      case (CONTROLLER_DOWN):
      case (CONTROLLER_OK):
      case (CONTROLLER_RED):
      case (CONTROLLER_GREEN):
      case (CONTROLLER_YELLOW):
      case (CONTROLLER_BLUE):
      default:
        break
    }
  }
}
