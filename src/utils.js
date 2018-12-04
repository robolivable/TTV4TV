/*
 * The MIT License (MIT) Copyright (c) 2018 Robert Oliveira
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import config from './config'

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
