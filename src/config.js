const APP_NAME = 'TTV4TV'

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
    users: '/users',
  },
  CLIENT_ID: 'lp9mi95ti4smw3c3ezxgakwd6dt65x',
  FORCE_VERIFY: false,
  URL: 'https://api.twitch.tv',
  REDIRECT_URL: '',
  RESPONSE_TYPE: 'token',
  SCOPES: [
    'channel_read',
    'user_read',
    'user_subscriptions',
  ],
}

module.exports = {
  APP_NAME,
  Twitch,
}
