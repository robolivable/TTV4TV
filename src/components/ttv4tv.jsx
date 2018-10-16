import config from '../config'
import MediaContent from './media-content'
import React from 'react'
import SearchBar from './search-bar'
import SideBar from './side-bar'
import Twitch from '../clients/twitch'
import TwitchPlayer from './twitch-player'

import Navigation, {
  HorizontalList,
  VerticalList
} from 'react-key-navigation'

export default class TTV4TV extends React.Component {
  constructor (props) {
    super(props)
    this._handleMediaClick = this._handleMediaClick.bind(this)
    this._handleListOnFocus = this._handleListOnFocus.bind(this)
    this._handleVerticalListOnBlur = this._handleVerticalListOnBlur.bind(this)
    this._handleOnKeyDown = this._handleOnKeyDown.bind(this)
    this.setSearchBarIsVisible = this.setSearchBarIsVisible.bind(this)
    this.setNavigation = this.setNavigation.bind(this)
    this.state = {
      activeFocus: null,
      isMediaPlayerEnabled: false,
      media: null,
      fetched: {},
      subscribed: [],
      following: [],
      streams: [],
      topGames: [],
      lists: [],
      searchBarIsVisible: true,
      navigation: config.NAVIGATION_HOME
    }
    this.twitch = new Twitch()
  }

  async componentDidMount () {
    switch (this.state.navigation) {
      case (config.NAVIGATION_HOME):
        if (this.state.fetched[config.NAVIGATION_HOME]) {
          return
        }

        document.addEventListener('keydown', this._handleOnKeyDown, false)

        const lists = await Promise.all([
          (async () => {
            const val = await this.twitch.subscribed()
            return {
              name: 'subsriptions',
              type: 'hzlist',
              dims: [320, 180],
              mediaMargin: 0,
              namePretty: 'Subscriptions',
              caption: 'Channels you are subscribed to',
              val
            }
          })(),
          (async () => {
            const val = await this.twitch.following()
            return {
              name: 'following',
              type: 'hzlist',
              dims: [320, 180],
              mediaMargin: 0,
              namePretty: 'Following',
              caption: 'Channels you follow',
              val
            }
          })(),
          (async () => {
            const val = await this.twitch.topGames()
            return {
              name: 'topGames',
              type: 'hzlist',
              dims: [272, 380],
              mediaMargin: 0,
              namePretty: 'Featured Games',
              caption: 'Games people are watching now',
              val
            }
          })(),
          (async () => {
            const val = await this.twitch.streams()
            return {
              name: 'streams',
              type: 'grid',
              dims: [320, 180],
              mediaMargin: 40,
              namePretty: 'Top Live Channels',
              caption: 'Broadcasters people are watching right now',
              val
            }
          })()
        ])

        const fetched = Object.assign(
          {}, this.state.fetched, { [config.NAVIGATION_HOME]: true }
        )
        this.setState({
          fetched,
          subscribed: lists[0].val,
          following: lists[1].val,
          topGames: lists[2].val,
          streams: lists[3].val,
          lists
        })
        break
      default:
        break
    }
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
            <SideBar
              setNavigation={this.setNavigation}
            />
            <div className='mainbox'>
              {this.state.navigation === config.NAVIGATION_HOME ?
                <VerticalList navDefault>
                  <SearchBar
                    visible={this.state.searchBarIsVisible}
                  />
                  <VerticalList
                    className='content'
                    onBlur={this._handleVerticalListOnBlur}
                  >
                    {this.state.lists.map((list, key) =>
                      !!list.val && !!list.val.length ? <MediaContent
                        key={key}
                        title={list.namePretty}
                        caption={list.caption}
                        name={list.name}
                        type={list.type}
                        dims={list.dims}
                        mediaMargin={list.mediaMargin}
                        medias={list.val || []}
                        onFocus={this._handleListOnFocus(key)}
                        visible={(this.state.activeFocus === null ||
                                 key >= this.state.activeFocus)}
                        onMediaClick={this._handleMediaClick}
                        setSearchBarIsVisible={this.setSearchBarIsVisible}
                      /> : null
                    )}
                  </VerticalList>
                </VerticalList>
               : null}
              {this.state.navigation === config.NAVIGATION_CHANNELS_FOLLOWING ?
                <div>
                  CHANNELS FOLLOWING!
                </div>
              : null}
              {this.state.navigation === config.NAVIGATION_CHANNELS_SUBBED ?
                <div>
                  CHANNELS SUBBED!
                </div>
              : null}
              {this.state.navigation === config.NAVIGATION_CHANNELS ?
                <div>
                  CHANNELS!
                </div>
              : null}
              {this.state.navigation === config.NAVIGATION_GAMES ?
                <div>
                  GAMES!
                </div>
              : null}
              {this.state.navigation === config.NAVIGATION_STREAMS ?
                <div>
                  STREAMS!
                </div>
              : null}
              {this.state.navigation === config.NAVIGATION_SEARCH ?
                <div>
                  SEARCH!
                </div>
              : null}
              {this.state.navigation === config.NAVIGATION_LOGIN ?
                <div>
                  LOGIN!
                </div>
              : null}
            </div>
          </HorizontalList>
        </div>
      </Navigation>
    )
  }

  setNavigation (navigation) {
    this.setState({ navigation })
  }

  setSearchBarIsVisible (searchBarIsVisible) {
    this.setState({ searchBarIsVisible })
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
      case (config.KEYBOARD_ESCAPE):
      case (config.CONTROLLER_BACK):
        e.preventDefault()
        e.stopPropagation()
        this.setState({ isMediaPlayerEnabled: false, media: null })
        break
      case (config.CONTROLLER_LEFT):
      case (config.CONTROLLER_UP):
      case (config.CONTROLLER_RIGHT):
      case (config.CONTROLLER_DOWN):
      case (config.CONTROLLER_OK):
      case (config.CONTROLLER_RED):
      case (config.CONTROLLER_GREEN):
      case (config.CONTROLLER_YELLOW):
      case (config.CONTROLLER_BLUE):
      default:
        break
    }
  }
}
