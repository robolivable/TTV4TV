import React from 'react'

import { Focusable } from 'react-key-navigation'

export default class TwitchMedia extends React.Component {
  constructor (props) {
    super(props)
    this._handleFocusableOnFocus = this._handleFocusableOnFocus.bind(this)
    this._handleFocusableOnBlur = this._handleFocusableOnBlur.bind(this)
    this.state = { active: false }
  }

  render () {
    const className = `${this.props.className} ` +
                      `item${(this.state.active && ' item-focus') || ''}`
    return (
      <Focusable
        onFocus={this._handleFocusableOnFocus}
        onBlur={this._handleFocusableOnBlur}
      >
        <div
          className={className}
          onClick={this.props.onMediaClick}
          style={{
            backgroundImage: `url("${this.props.previewUrl}")`,
            backgroundSize: 'cover'
          }}
        />
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
