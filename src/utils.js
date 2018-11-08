const config = require('./config')

const isDOMElement = o => {
  return !!(
    typeof HTMLElement === 'object'
      ? o instanceof HTMLElement
      : o &&
    typeof o === 'object' &&
    o !== null &&
    o.nodeType === 1 &&
    typeof o.nodeName === 'string'
  )
}

const mediaPropsByType = (type, item) => {
  switch (type) {
    case config.TWITCH_MEDIA_PROP_TYPES.subscribed:
      return {
        id: item.get('channel').display_name,
        previewUrl: item.get('channel').logo
      }
    case config.TWITCH_MEDIA_PROP_TYPES.following:
      return {
        id: item.get('channel').display_name,
        previewUrl: item.get('channel').logo
      }
    case config.TWITCH_MEDIA_PROP_TYPES.topGames:
      return {
        id: item.get('game').name,
        gameTitle: item.get('game').name,
        previewUrl: item.get('game').box.large,
        viewCount: item.get('viewers')
      }
    case config.TWITCH_MEDIA_PROP_TYPES.channels:
      return {
        id: item.get('name'),
        gameTitle: item.get('display_name'),
        previewUrl: item.get('logo'),
        viewCount: item.get('followers')
      }
    case config.TWITCH_MEDIA_PROP_TYPES.games:
      return {
        id: item.get('name'),
        gameTitle: item.get('name'),
        previewUrl: item.get('box').large,
        viewCount: item.get('popularity')
      }
    case config.TWITCH_MEDIA_PROP_TYPES.streams:
      return {
        id: item.get('channel').display_name,
        gameTitle: item.get('channel').game,
        name: item.get('channel').name,
        previewUrl: item.get('preview').medium,
        statusText: item.get('channel').status,
        viewCount: item.get('viewers')
      }
    default:
      return {}
  }
}

const parseURLAuthParams = hash => {
  if (!hash) {
    return []
  }
  const params = Object.assign(...hash.split('#')[1].split('&').map(
    kvs => { const kv = kvs.split('='); return { [kv[0]]: kv[1] } }
  ))
  return [ params.access_token, params.state ]
}

export default {
  isDOMElement,
  mediaPropsByType,
  parseURLAuthParams
}
