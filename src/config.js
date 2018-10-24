const APP_NAME = 'TTV4TV'

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

const NAVIGATION_HOME = 'home'
const NAVIGATION_CHANNELS = 'channels'
const NAVIGATION_CHANNELS_FOLLOWING = 'channels_following'
const NAVIGATION_CHANNELS_SUBBED = 'channels_subbed'
const NAVIGATION_GAMES = 'games'
const NAVIGATION_STREAMS = 'streams'
const NAVIGATION_GAME_STREAMS = 'game_streams'
const NAVIGATION_SEARCH = 'search'
const NAVIGATION_LOGIN = 'login'

const PLAYER_INIT_WIDTH = '100%'
const PLAYER_INIT_HEIGHT = '100%'
const PLAYER_INIT_VOLUME = 0.5

const MEDIA_TYPES = {
  following: 'following',
  streams: 'streams',
  subscribed: 'subscribed',
  topGames: 'topGames'
}

const MEDIA_PLAYER_TYPES = {
  following: 'channel',
  streams: 'channel',
  subscribed: 'channel',
  topGames: 'game'
}

const TWITCH_PLAYER_ID = 'ttv4tv-player'

const Twitch = {
  ACCEPT: 'application/vnd.twitchtv.v5+json',
  AUTHORIZATION: 'OAuth',
  AUTHORIZATION_ENDPOINT: 'https://id.twitch.tv/oauth2/authorize',
  API_NEW: '/helix',
  API_V5: '/kraken',
  DIRS: {
    channels: '/channels',
    games: '/games',
    topGames: '/games/top',
    streams: '/streams',
    user: '/user',
    users: '/users'
  },
  CLIENT_ID: 'lp9mi95ti4smw3c3ezxgakwd6dt65x',
  FORCE_VERIFY: false,
  URL: 'https://api.twitch.tv',
  REDIRECT_URL: '',
  RESPONSE_TYPE: 'token',
  SCOPES: [
    'channel_read',
    'user_read',
    'user_subscriptions'
  ]
}

module.exports = {
  APP_NAME,
  CONTROLLER_BACK,
  CONTROLLER_BLUE,
  CONTROLLER_DOWN,
  CONTROLLER_GREEN,
  CONTROLLER_LEFT,
  CONTROLLER_OK,
  CONTROLLER_RED,
  CONTROLLER_RIGHT,
  CONTROLLER_UP,
  CONTROLLER_YELLOW,
  KEYBOARD_ESCAPE,
  MEDIA_PLAYER_TYPES,
  MEDIA_TYPES,
  NAVIGATION_CHANNELS,
  NAVIGATION_GAMES,
  NAVIGATION_HOME,
  NAVIGATION_LOGIN,
  NAVIGATION_SEARCH,
  NAVIGATION_STREAMS,
  PLAYER_INIT_HEIGHT,
  PLAYER_INIT_VOLUME,
  PLAYER_INIT_WIDTH,
  Twitch,
  TWITCH_PLAYER_ID
}
