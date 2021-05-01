import http from './httpService'

const apiEndpoint = '/data'

export function getAssets() {
    return http.get(`${apiEndpoint}/`).then(res => console.log(res))
  }

export function updateAssets() {
  return http.get(`${apiEndpoint}/updateAssets`).then(res => console.log(res))
}
  
export function postAsset(id) {
  return http.post(`${apiEndpoint}/`, {ticker:id}).then((res) => res)
}

// export async function updateAssets(user){
//   const url = apiEndpoint + "/updateAssets"
//   const res = await http.post(url,  {
//       user: user
//   })
//   return res
// }