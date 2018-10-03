import config from './config'
import React from 'react'
import ReactTV from 'react-tv'
import Twitch from './clients/twitch'

import Navigation, { VerticalList, HorizontalList } from 'react-key-navigation'

class List extends React.Component {}

class Search extends React.Component {}

class Sidebar extends React.Component {}

class TwitchPlayer extends React.Component {
  componentDidUpdate () {
    (new window.Twitch.Player(
      config.TWITCH_PLAYER_ID,
      Object.assign({ width: '100%', height: '100%' }, this.props)
    )).setVolume(0.5)
  }

  render () {
    return <div id={config.TWITCH_PLAYER_ID}></div>
  }
}

class TTV4TV extends React.Component {
  constructor (props) {
    super(props)
    this._handleTwitchPlayerOnClose = this._handleTwitchPlayerOnClose.bind(this)
    this.state = {
      isMediaPlayerEnabled: false,
      media: null
    }
    this.twitch = new Twitch()
  }

  async componentDidUpdate () {}

  async componentDidMount () {}

  render() {
    return (
      <Navigation>
        {this.state.isMediaPlayerEnabled ? () => {
          switch (this.state.media.type) {
            case 'collection':
              return (
                <TwitchPlayer
                  onClose={this._handleTwitchPlayerOnClose}
                  collection={this.state.media.collection}
                />
              )
            case 'video':
              return (
                <TwitchPlayer
                  onClose={this._handleTwitchPlayerOnClose}
                  video={this.state.media.video}
                />
              )
            case 'channel':
            default:
              return (
                <TwitchPlayer
                  onClose={this._handleTwitchPlayerOnClose}
                  channel={this.state.media.channel}
                />
              )
          }
        } : null}
        <HorizontalList>
          <Sidebar/>

          <VerticalList navDefault>
            <Search/>
            <VerticalList>
              {this.twitch.topGames().map((game, key) => (
                <List
                  key={key}
                  title={game.get('name')}
                  onFocus={}
                  visible={}
                  onClick={}
                />
              ))}
            </VerticalList>
          </VerticalList>
        </HorizontalList>
      </Navigation>
    )
  }

  _handleTwitchPlayerOnClose () {
    this.setState({ isMediaPlayerEnabled: false })
  }
}

ReactTV.render(<TTV4TV />, document.querySelector('#root'))
