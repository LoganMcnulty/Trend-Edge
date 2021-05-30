import http from './httpService'

const apiEndpoint = '/data'

// export function getAssets() {
//     return http.get(`${apiEndpoint}/`).then(res => res)
//   }

  // export function getWLAssets() {
  //   return http.get(`${apiEndpoint}/wlAssetObjects`).then(res => res)
  // }

// export function getAssetNames() {
//   return http.get(`${apiEndpoint}/assetNames`).then(res => res)
// }

export function getWLAssetNames() {
  return http.get(`${apiEndpoint}/wlAssetNames`).then(res => res)
}

export function getTrendEdge(assetNameList, settings){
  const {fastSMA, slowSMA, lookback, fastWeight, slowWeight, fastOverSlowWeight, macdWeight, adxWeight} = settings
  let assetString = ''
  assetNameList.forEach(asset => {
    assetString += `${asset},`
  })
  const url = `${apiEndpoint}/aggregatedData/${assetString}/${fastSMA}/${slowSMA}/${lookback}/${fastWeight}/${slowWeight}/${fastOverSlowWeight}/${macdWeight}/${adxWeight}`
  return http.get(url).then(res => res)
}

export function updateAssets() {
  return http.get(`${apiEndpoint}/updateAssets`).then(res => console.log(res))
}
  
export function postAsset(id) {
  return http.post(`${apiEndpoint}/`, {data:id}).then(res => res)
}

// export async function updateAssets(user){
//   const url = apiEndpoint + "/updateAssets"
//   const res = await http.post(url,  {
//       user: user
//   })
//   return res
// }