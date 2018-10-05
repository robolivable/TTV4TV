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

export default class TTV4TV extends React.Component {
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
      // async () => ({ name: 'subscribed', val: await this.twitch.subscribed()}),
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
      })()
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

  render () {
    return (
      <Navigation>
        <div className='container'>
          {this.state.isMediaPlayerEnabled ? (() => {
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

  _handleTwitchPlayerOnClose () {
    this.setState({ isMediaPlayerEnabled: false, media: null })
  }
}
