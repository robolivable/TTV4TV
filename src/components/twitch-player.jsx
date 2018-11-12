import config from '../config'
import React from 'react'

export default class TwitchPlayer extends React.Component {
  componentDidMount () {
    (new window.Twitch.Player(
      config.TWITCH_PLAYER_ID,
      Object.assign({
        width: config.PLAYER_INIT_WIDTH,
        height: config.PLAYER_INIT_HEIGHT
      }, this.props.options)
    )).setVolume(config.PLAYER_INIT_VOLUME)
  }

  render () {
    return (
      <div
        id={config.TWITCH_PLAYER_ID}
        style={{
          width: '-webkit-fill-available',
          height: '-webkit-fill-available'
        }}
      />
    )
  }
}
