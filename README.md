#### What is TTV4TV?
TTV4TV (Twitch TV for TV) is a front-end smart TV application powered by [React-TV](https://github.com/raphamorim/react-tv). It extends access to the [Twitch API](https://dev.twitch.tv/) to load streams directly so that unneeded features can be stripped away, and overhead can be minimized.

#### Features of this App
- UI/UX powered by React-TV
- List top streams (paginated)
- List top games (paginated)
- List streams filtered by game (paginated)
- Search channels, streams, and games
- Play streams using [embedded Twitch media player](https://dev.twitch.tv/docs/embed/video-and-clips/)
- Login (server-less [OAuth implicit flow](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-implicit-code-flow))
- List channels you follow

##### Note on "session based" features (a.k.a., login)
Server-less login support exists for this App, with a single exception. For server-less login to work, this app must be served remotely using the [Hosted Web App flow](http://webostv.developer.lge.com/develop/app-developer-guide/hosted-web-app/) (yes, you read that correctly). The reason Twitch login is so limited here is due to two major blockers involving webOS and Twitch API:
1. Twitch currently has no login support for limited input devices (as in TVs, IoTs, etc.). See [this neat Google guide](https://developers.google.com/identity/protocols/OAuth2ForDevices) for an example of what the typical flow looks like.
2. A webOS TV application is **unable to redirect back to itself**. What does this mean for Twitch API OAuth login? The answer is that logging in using the Twitch API OAuth flow requires leveraging the address bar for securely communicating access tokens. The flow works using a two-way channel established with a redirect URL. The inability to redirect back to the application cripples the flow, blocking out the incoming access token, disabling the login.

#### What's missing?
The ability to display a list of channels the current logged-in user is subscribed to. This feature was actually planned/groomed to be included in the POC for this App. The reason it was excluded is the need for a back-end: https://twitchemotes.com/apidocs (refer to the "Caching" section of that doc).

Currently the only way (that I know of) to fetch a list of subscriptions is to map emoticon set IDs to channels. The free service mentioned provides this, but it requires a proprietary server to cache the mapping (the mapping is provided as a large flat file).

#### Screenshots
![screen shot 2018-11-08 at 10 31 22 am](https://user-images.githubusercontent.com/7831876/48208799-9eb76a80-e341-11e8-8d5e-39abf17e085e.png)
![screen shot 2018-11-08 at 10 31 32 am](https://user-images.githubusercontent.com/7831876/48208834-b42c9480-e341-11e8-9fb3-bc3df588635c.png)
![screen shot 2018-11-08 at 10 23 54 am](https://user-images.githubusercontent.com/7831876/48208839-babb0c00-e341-11e8-9d8b-152a2be661d9.png)
![screen shot 2018-11-08 at 10 24 37 am](https://user-images.githubusercontent.com/7831876/48208861-c60e3780-e341-11e8-9989-ea742ffce2f2.png)
![screen shot 2018-11-08 at 10 24 50 am](https://user-images.githubusercontent.com/7831876/48208876-cc041880-e341-11e8-939e-5da65353a09f.png)
![screen shot 2018-11-08 at 10 25 16 am](https://user-images.githubusercontent.com/7831876/48208895-d7574400-e341-11e8-8822-9296b8982ed4.png)
![screen shot 2018-11-08 at 10 28 20 am](https://user-images.githubusercontent.com/7831876/48208912-dde5bb80-e341-11e8-8df3-7c13956a0e7f.png)
![screen shot 2018-11-08 at 10 29 48 am](https://user-images.githubusercontent.com/7831876/48208918-e2aa6f80-e341-11e8-9875-a64f38f2f0a6.png)
![screen shot 2018-11-08 at 10 30 11 am](https://user-images.githubusercontent.com/7831876/48208922-e8a05080-e341-11e8-98af-07bb0ac51656.png)
![screen shot 2018-11-08 at 10 30 20 am](https://user-images.githubusercontent.com/7831876/48208932-ed650480-e341-11e8-82a0-87f6415bc851.png)

#### Development
`npm` scripts are defined to facilitate building & running the project. Installing only requires an `npm install`.

#### Compatibility
TTV4TV is built on top of React-TV with hope that smart TV cross compatibility will improve with time. With that said, currently, this App has only been tested to work with webOS based platforms.

#### Contribution
Contribution is welcome through Github pull requests.

#### License
This software is distributed under The MIT License. See LICENSE.md for details.
