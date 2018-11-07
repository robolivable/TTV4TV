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
    this._handleSearchOnEnterDown = this._handleSearchOnEnterDown.bind(this)
    this.setSearchBarIsVisible = this.setSearchBarIsVisible.bind(this)
    this.setNavigation = this.setNavigation.bind(this)
    this.state = {
      activeFocus: null,
      isMediaPlayerEnabled: false,
      media: null,
      fetched: {},
      home: [],
      channels: [],
      channelsFollowing: [],
      channelsSubbed: [],
      games: [],
      streams: [],
      gameStreams: [],
      search: [],
      searchString: null,
      searchBarIsVisible: true,
      navigation: null
    }
    this.twitch = new Twitch()
  }

  componentDidMount () {
    document.addEventListener('keydown', this._handleOnKeyDown, false)
    this.setState({ navigation: config.NAVIGATION_HOME })
  }

  async componentDidUpdate () {
    console.info('Updated with navigation =>', this.state.navigation)
    switch (this.state.navigation) {
      case (config.NAVIGATION_HOME):
        if (this.state.fetched[config.NAVIGATION_HOME]) {
          return
        }

        const home = await Promise.all([
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

        var fetched = Object.assign(
          {}, this.state.fetched, { [config.NAVIGATION_HOME]: true }
        )
        this.setState({
          fetched,
          home
        })
        break

      case (config.NAVIGATION_CHANNELS_FOLLOWING):
        // TODO: sessions
        // TODO: channels following
        break

      case (config.NAVIGATION_CHANNELS_SUBBED):
        // TODO: sessions
        // TODO: channels subbed to
        break

      case (config.NAVIGATION_GAMES):
        if (this.state.fetched[config.NAVIGATION_GAMES]) {
          return
        }

        const games = await Promise.all([
          (async () => {
            const val = await this.twitch.topGames()
            return {
              name: 'topGames',
              type: 'grid',
              dims: [272, 380],
              mediaMargin: 40,
              namePretty: 'Games',
              caption: 'Games people are streaming right now',
              val
            }
          })()
        ])

        var fetched = Object.assign(
          {}, this.state.fetched, { [config.NAVIGATION_GAMES]: true }
        )
        this.setState({
          fetched,
          games
        })
        break

      case (config.NAVIGATION_STREAMS):
        if (this.state.fetched[config.NAVIGATION_STREAMS]) {
          return
        }

        const streams = await Promise.all([
          (async () => {
            const val = await this.twitch.streams()
            return {
              name: 'streams',
              type: 'grid',
              dims: [320, 180],
              mediaMargin: 40,
              namePretty: 'Live Streams',
              caption: 'Broadcasters that are live right now',
              val
            }
          })()
        ])

        var fetched = Object.assign(
          {}, this.state.fetched, { [config.NAVIGATION_STREAMS]: true }
        )
        this.setState({
          fetched,
          streams
        })
        break

      case (config.NAVIGATION_GAME_STREAMS):
        if (this.state.fetched[config.NAVIGATION_GAME_STREAMS] ===
            this.state.gameClicked) {
          // TODO: cache already fetched games? (LRU?)
          return
        }

        const gameStreams = await Promise.all([
          (async () => {
            const val = await this.twitch.gameStreams(this.state.gameClicked)
            return {
              name: 'streams',
              type: 'grid',
              dims: [320, 180],
              mediaMargin: 40,
              namePretty: 'Live Streams',
              caption: `Broadcasters that are streaming ` +
                       `${this.state.gameClicked}`,
              val
            }
          })()
        ])
        var fetched = Object.assign(
          {}, this.state.fetched,
          { [config.NAVIGATION_GAME_STREAMS]: this.state.gameClicked }
        )
        this.setState({
          fetched,
          gameStreams
        })
        break

      case (config.NAVIGATION_SEARCH):
        if (this.state.fetched[config.NAVIGATION_SEARCH] ===
            this.state.searchString) {
          // TODO: cache already fetched searches? (LRU?)
          return
        }

        const search = await Promise.all([
          (async () => {
            const val = await this.twitch.searchStreams(this.state.searchString)
            return {
              name: 'streams',
              type: 'grid',
              dims: [320, 180],
              mediaMargin: 40,
              namePretty: 'Live Streams',
              caption: `Stream results for ${this.state.searchString}`,
              val
            }
          })(),
          (async () => {
            const val = await this.twitch.searchChannels(this.state.searchString)
            return {
              name: 'channels',
              type: 'grid',
              dims: [272, 380],
              mediaMargin: 40,
              namePretty: 'Channels',
              caption: `Channel results for ${this.state.searchString}`,
              val
            }
          })(),
          (async () => {
            const val = await this.twitch.searchGames(this.state.searchString)
            return {
              name: 'games',
              type: 'grid',
              dims: [272, 380],
              mediaMargin: 40,
              namePretty: 'Games',
              caption: `Game results for ${this.state.searchString}`,
              val
            }
          })()
        ])
        var fetched = Object.assign(
          {}, this.state.fetched,
          { [config.NAVIGATION_SEARCH]: this.state.searchString }
        )
        this.setState({
          fetched,
          search
        })
        break

      default:
        break
    }
  }

  render () {
    // TODO: FIXME on NAVIGATION_GAME_STREAMS, we need to render unique keys
    //       so that a list render gets triggered... there is currently a temp
    //       hack to make `key` unique based on caption
    //       Additionally, the `key` prop is used for navigation...
    return (
      <Navigation>
        <div className='container'>
          {this.state.isMediaPlayerEnabled ? (() => {
            // TODO: fix side bar layering bug
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
              case config.MEDIA_PLAYER_TYPES.streams:
              case config.MEDIA_PLAYER_TYPES.channels:
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
              <VerticalList navDefault>
                <SearchBar
                  visible={this.state.searchBarIsVisible}
                  onEnterDown={this._handleSearchOnEnterDown}
                />
                {this.state.navigation === config.NAVIGATION_HOME ?
                  <VerticalList
                    className='content'
                    onBlur={this._handleVerticalListOnBlur}
                  >
                    {this.state.home.map((list, key) =>
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
                        disablePagination
                      /> : null
                    )}
                  </VerticalList>
                : null}
                {this.state.navigation === config.NAVIGATION_CHANNELS_FOLLOWING ?
                  <VerticalList
                    className='content'
                    onBlur={this._handleVerticalListOnBlur}
                  >
                    {this.state.channelsFollowing.map((list, key) =>
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
                        disablePagination
                      /> : null
                    )}
                  </VerticalList>
                : null}
                {this.state.navigation === config.NAVIGATION_CHANNELS_SUBBED ?
                  <VerticalList
                    className='content'
                    onBlur={this._handleVerticalListOnBlur}
                  >
                    {this.state.channelsSubbed.map((list, key) =>
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
                        disablePagination
                      /> : null
                    )}
                  </VerticalList>
                : null}
                {this.state.navigation === config.NAVIGATION_GAMES ?
                  <VerticalList
                    className='content'
                    onBlur={this._handleVerticalListOnBlur}
                  >
                    {this.state.games.map((list, key) =>
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
                : null}
                {this.state.navigation === config.NAVIGATION_STREAMS ?
                  <VerticalList
                    className='content'
                    onBlur={this._handleVerticalListOnBlur}
                  >
                    {this.state.streams.map((list, key) =>
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
                : null}
                {this.state.navigation === config.NAVIGATION_GAME_STREAMS ?
                  <VerticalList
                    className='content'
                    onBlur={this._handleVerticalListOnBlur}
                  >
                    {this.state.gameStreams.map((list, key) =>
                      !!list.val && !!list.val.length ? <MediaContent
                        key={key+list.caption}
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
                : null}
                {this.state.navigation === config.NAVIGATION_SEARCH ?
                  <VerticalList
                    className='content'
                    onBlur={this._handleVerticalListOnBlur}
                  >
                    {this.state.search.map((list, key) =>
                      !!list.val && !!list.val.length ? <MediaContent
                        key={key+list.caption}
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
                        disablePagination
                      /> : <div>
                        <div className='content-header'>
                          <h1 className='content-title'>
                            {list.namePretty}
                          </h1>
                          <h4 className='content-caption'>
                            No results
                          </h4>
                        </div>
                      </div>
                    )}
                  </VerticalList>
                : null}
                {this.state.navigation === config.NAVIGATION_LOGIN ?
                  <div>
                    LOGIN!!!
                  </div>
                : null}
              </VerticalList>
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
      switch (type) {
        case (config.MEDIA_PLAYER_TYPES.topGames):
          this.setState({
            gameClicked: id,
            navigation: config.NAVIGATION_GAME_STREAMS
          })
          return
        case (config.MEDIA_PLAYER_TYPES.streams):
          this.setState({
            isMediaPlayerEnabled: true,
            media: { type, id }
          })
          return
        case (config.MEDIA_PLAYER_TYPES.channels):
          this.setState({
            isMediaPlayerEnabled: true,
            media: { type, id }
          })
          return
        default:
          return
      }
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

  _handleSearchOnEnterDown (wrappedFunc) {
    return (...args) => {
      const searchString = sessionStorage.getItem(
        config.SESSION_SEARCH_BAR_INPUT_VALUE
      )
      console.debug('search =>', searchString)
      this.setState({
        searchString,
        navigation: config.NAVIGATION_SEARCH
      })
      wrappedFunc(...args)
    }
  }
}
