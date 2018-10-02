const config = require('./config')
const uuid4 = require('uuid/v4')

class TwitchAuthorization {
  constructor (token) {
    this.type = config.Twitch.AUTHORIZATION
    this.token = token
  }

  get header () {
    return `${config.Twitch.AUTHORIZATION} ${this.token}`
  }
}

class TwitchResource {
  constructor (directory, auth) {
    this.client = fetch
    this.directory = directory
    this.authorization = auth
  }

  async get (key='', directory='') {
    return await (await this.client(
      config.Twitch.URL + directory || this.directory + key,
      {
        headers: {
          Accept: config.Twitch.ACCEPT,
          'Client-ID': config.Twitch.CLIENT_ID,
          Authorization: `${this.authorization.header}`,
        }
      }
    )).json()
  }
}

class TwitchObject {
  constructor ({ key='', dir='/', auth=null }, props={}) {
    this.key = key
    this.resource = new TwitchResource(dir, auth)
    this._properties = {}
    this.properties = props
  }

  get (key) {
    if (!this.properties[key]) {
      return null
    }
    return this.properties[key]
  }

  async fetch () {
    this._properties = await this.resource.get(this.key)
    if (Object.keys(this._properties).length === 0) {
      return this
    }
    this.properties = JSON.parse(JSON.stringify(this._properties))
    return this
  }
}

class TwitchObjectCollection {
  constructor (clazz, { key='', dir='/', auth=null }) {
    this.clazz = clazz
    this.key = key
    this.resource = new TwitchResource(dir, auth)
    this.collection = []
  }

  async fetch () {
    this.collection = await this.resource.get()
  }

  * iter () {
    for (const object of this.collection) {
      yield this.clazz(object._id, object)
    }
  }
}

class Channel extends TwitchObject {
  constructor (key='', props={}, auth=null) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.channels
    super({ key, dir, auth }, props)
  }
}

class Game extends TwitchObject {
  constructor (key='', props={}, auth=null) {
    const dir = config.Twitch.API_NEW + config.Twitch.DIRS.games
    super({ key, dir, auth }, props)
  }
}

class Stream extends TwitchObject {
  constructor (key='', props={}, auth=null) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.streams
    super({ key, dir, auth }, props)
  }
}

class User extends TwitchObject {
  constructor (key='', props={}, auth=null) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.user
    super({ key, dir, auth }, props)
  }

  async emotes () {
    return await this.resource.get('', `/users/${this.get('_id')}/emotes`)
  }

  async follows () {
    return await this.resource.get(
      '', `/users/${this.get('_id')}/follows/channels`
    )
  }
}

class Channels extends TwitchObjectCollection {
  constructor (key='', auth=null) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.channels
    super(Channel, { key, dir, auth })
  }
}

class Streams extends TwitchObjectCollection {
  constructor (key='', auth=null) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.streams
    super(Stream, { key, dir, auth })
  }
}

class TopGames extends TwitchObjectCollection {
  constructor (key='', auth=null) {
    const dir = config.Twitch.API_NEW + config.Twitch.DIRS.topGames
    super(Channel, { key, dir, auth })
  }
}

class Twitch {
  constructor () {
    this.auth = null
    this.state = uuid4()
    this.user = null
  }

  get authenticationEndpoint () {
    return `${config.Twitch.AUTHORIZATION_ENDPOINT}` +
           `?client_id=${config.Twitch.CLIENT_ID}` +
           `&redirect_uri=${config.Twitch.REDIRECT_URI}` +
           `&response_type=${config.Twitch.RESPONSE_TYPE}` +
           `&scope=${config.Twitch.SCOPES.join(' ')} ` +
           `&state=${this.state}`
  }

  async authenticate (token, state) {
    if (state !== this.state) {
      return
    }
    this.auth = new Authorization(token)
    this.user = new User('', {}, this.auth)
    await this.user.fetch()
  }

  async subscribed () {
    // TODO: find out how to cross reference emotes to channels
  }

  async following () {
    return await this.user.follows()
  }

  async topGames () {
    const topGames = new TopGames('', this.auth)
    await topGames.fetch()
    return Array.from(topGames.iter())
  }

  async streams () {
    const streams = new Streams('', this.auth)
    await streams.fetch()
    return Array.from(streams.iter())
  }
}

module.exports = Twitch
