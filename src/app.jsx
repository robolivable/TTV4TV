import React from 'react'
import ReactTV from 'react-tv'

import Navigation, { VerticalList, HorizontalList } from 'react-key-navigation'

class List extends React.Component {}

class Search extends React.Component {}

class Sidebar extends React.Component {}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  async componentDidMount () {}

  async componentDidUpdate () {}

  render() {
    return (
      <Navigation>
        <HorizontalList>
          <Sidebar/>
          <VerticalList navDefault>
            <Search/>
            <VerticalList>
              {}
            </VerticalList>
          </VerticalList>
        </HorizontalList>
      </Navigation>
    )
  }
}

ReactTV.render(
  ,
  document.querySelector('#root')
)
