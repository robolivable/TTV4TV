const mediaPropsByType = (type, item) => {
  switch (type) {
    case 'subscribed':
      return {
        id: item.get('channel').display_name,
        previewUrl: item.get('channel').logo
      }
    case 'followed':
      return {
        id: item.get('channel').display_name,
        previewUrl: item.get('channel').logo
      }
    case 'topGames':
      return {
        id: item.get('game')._id,
        previewUrl: item.get('game').box.large,
        viewCount: item.get('viewers')
      }
    case 'streams':
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
export default {
  mediaPropsByType
}
