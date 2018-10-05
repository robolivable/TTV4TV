const APP_NAME = 'TTV4TV'

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
  MEDIA_TYPES,
  MEDIA_PLAYER_TYPES,
  PLAYER_INIT_HEIGHT,
  PLAYER_INIT_VOLUME,
  PLAYER_INIT_WIDTH,
  Twitch,
  TWITCH_PLAYER_ID
}
