import config from '../config'
import uuid4 from 'uuid/v4'

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
    this.directory = directory
    this.authorization = auth
    this.limit = 25
    this.offset = 0
  }

  async get (key = '', directory = '', qs = {}) {
    try {
      const args = [
        `${config.Twitch.URL}${directory || this.directory}${key}` +
        `?offset=${this.offset}&limit=${this.limit}` +
        `${Object.keys(qs).map(
          k => `&${k}=${encodeURIComponent(qs[k])}`
        ).join()}`,
        {
          headers: {
            Accept: config.Twitch.ACCEPT,
            'Client-ID': config.Twitch.CLIENT_ID,
            Authorization: `${this.authorization.header}`
          }
        }
      ]
      console.debug('Sending HTTP request =>', args)
      const result = await (await fetch(...args)).json()
      console.debug('HTTP response received =>', result)
      this.offset = this.offset + this.limit
      return result
    } catch (error) {
      console.error(
        'key =>', key,
        'directory =>', directory,
        'qs =>', qs,
        error
      )
    }
  }
}

class TwitchObject {
  constructor ({ key = '', dir = '/', auth = {} }, props = {}) {
    this.key = key
    this.resource = new TwitchResource(dir, auth)
    this._properties = {}
    this.properties = props
  }

  get isEmpty () {
    return !Object.keys(this._properties).length
  }

  get (key) {
    if (this.properties[key] === undefined || this.properties[key] === null) {
      return null
    }
    return this.properties[key]
  }

  async fetch () {
    this._properties = await this.resource.get(this.key)
    if (Object.keys(this._properties).length === 0) {
      return
    }
    this.properties = JSON.parse(JSON.stringify(this._properties))
  }
}

class TwitchObjectCollection {
  constructor (clazz, { key = '', dir = '/', auth = {} }) {
    this.clazz = clazz
    this.key = key
    this.resource = new TwitchResource(dir, auth)
    this.collection = []
  }

  async fetch () {
    // TODO: FIXME memory leak when this.collection becomes huge
    this.collection = this.collection.concat(await this.resource.get(this.key))
  }

  * iter () {
    for (const object of this.collection) {
      yield new this.clazz(object._id, object) // eslint-disable-line
    }
  }

  get length () {
    return this.collection.length
  }

  map (func) {
    return this.collection.map((object, key) => func(
      new this.clazz(object._id, object), key // eslint-disable-line
    ))
  }
}

class Channel extends TwitchObject {
  constructor (key = '', props = {}, auth = {}) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.channels
    super({ key, dir, auth }, props)
  }
}

class Game extends TwitchObject {
  constructor (key = '', props = {}, auth = {}) {
    const dir = config.Twitch.API_NEW + config.Twitch.DIRS.games
    super({ key, dir, auth }, props)
  }
}

class Stream extends TwitchObject {
  constructor (key = '', props = {}, auth = {}) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.streams
    super({ key, dir, auth }, props)
  }
}

class User extends TwitchObject {
  constructor (key = '', props = {}, auth = {}) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.user
    super({ key, dir, auth }, props)
    this.auth = auth
  }

  async follows () {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.users
    const follows = new Follows(
      `/${this.get('_id')}/follows/channels`, dir, this.auth
    )
    await follows.fetch()
    return follows
  }
}

class Follows extends TwitchObjectCollection {
  constructor (key = '', dir = '', auth = {}) {
    super(Channel, { key, dir, auth })
  }

  async fetch () {
    // TODO: FIXME memory leak when this.collection becomes huge
    this.collection = this.collection.concat((
      await this.resource.get(this.key, '', { sortby: 'last_broadcast' })
    ).follows.map(item => item.channel))
  }
}

class Channels extends TwitchObjectCollection {
  constructor (key = '', auth = {}, directory = '') {
    const dir = directory || config.Twitch.API_V5 + config.Twitch.DIRS.channels
    super(Channel, { key, dir, auth })
  }

  async search (query) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.search
    this.collection = this.collection.concat(
      (await this.resource.get('/channels', dir, { query })).channels || []
    )
    this.collection.sort((a, b) =>
      new Channel('', b).get('followers') - new Channel('', a).get('followers')
    )
  }
}

class Streams extends TwitchObjectCollection {
  constructor (key = '', auth = {}) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.streams
    super(Stream, { key, dir, auth })
  }

  async fetch () {
    // TODO: FIXME memory leak when this.collection becomes huge
    this.collection = this.collection.concat((
      await this.resource.get()
    ).streams)
  }

  async search (query) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.search
    this.collection = this.collection.concat(
      (await this.resource.get('/streams', dir, { query })).streams || []
    )
  }
}

class TopGames extends TwitchObjectCollection {
  constructor (key = '', auth = {}) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.topGames
    super(Game, { key, dir, auth })
  }

  async fetch () {
    // TODO: FIXME memory leak when this.collection becomes huge
    this.collection = this.collection.concat((await this.resource.get()).top)
  }

  async search (query) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.search
    this.collection = this.collection.concat(
      (await this.resource.get('/games', dir, { query })).games || []
    )
  }
}

class GameStreams extends TwitchObjectCollection {
  constructor (key = '', auth = {}) {
    const dir = config.Twitch.API_V5 + config.Twitch.DIRS.streams
    super(Stream, { key, dir, auth })
  }

  async fetch () {
    // TODO: FIXME memory leak when this.collection becomes huge
    this.collection = this.collection.concat((
      await this.resource.get('', '', { game: this.key })
    ).streams)
  }
}

class Twitch {
  constructor () {
    this.auth = {}
    this.user = {}
    if (!sessionStorage.getItem('state')) {
      sessionStorage.setItem('state', uuid4().replace(/-/g, ''))
    }
  }

  get authenticationEndpoint () {
    return `${config.Twitch.AUTHORIZATION_ENDPOINT}` +
           `?client_id=${config.Twitch.CLIENT_ID}` +
           `&redirect_uri=${config.Twitch.AUTHORIZATION_REDIRECT}` +
           `&response_type=${config.Twitch.AUTHORIZATION_RESPONSE_TYPE}` +
           `&scope=${config.Twitch.AUTHORIZATION_SCOPES.join(' ')}` +
           `&state=${sessionStorage.getItem('state')}` +
           `&force_verify=true`
  }

  get isAuthorized () {
    return !!this.auth.token
  }

  invalidateAuthorization () {
    this.auth = {}
    sessionStorage.removeItem('token')
  }

  async authenticate (token, state) {
    if (state !== sessionStorage.getItem('state')) {
      return
    }
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('state', uuid4().replace(/-/g, ''))
    this.auth = new TwitchAuthorization(token)
    this.user = new User('', {}, this.auth)
    await this.user.fetch()
  }

  async following () {
    let follows = []
    if (!this.user.follows || this.user.isEmpty) {
      return follows
    }
    follows = await this.user.follows()
    return follows
  }

  async topGames () {
    const topGames = new TopGames('', this.auth)
    await topGames.fetch()
    return topGames
  }

  async streams () {
    const streams = new Streams('', this.auth)
    await streams.fetch()
    return streams
  }

  async gameStreams (game) {
    const gameStreams = new GameStreams(game, this.auth)
    await gameStreams.fetch()
    return gameStreams
  }

  async searchChannels (string) {
    const channels = new Channels('', this.auth)
    await channels.search(string)
    return channels
  }

  async searchGames (string) {
    const topGames = new TopGames('', this.auth)
    await topGames.search(string)
    return topGames
  }

  async searchStreams (string) {
    const streams = new Streams('', this.auth)
    await streams.search(string)
    return streams
  }
}

export default Twitch
