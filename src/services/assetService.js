import http from './httpService'

export function getAssets() {
    return http.get('/data/assets')
  }
  
export function postAsset(id) {
  return http.post('/data', {ticker:id})
}