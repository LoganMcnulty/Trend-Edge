import http from './httpService'

const apiEndpoint = '/admin'

export async function removeUsers(user) {
    const url = apiEndpoint + "/removeUsers"
    await http.post(url,  {
        user: user
    })
    return console.log('Users Removed')
}

export async function emptyAssetDB() {
    const url = apiEndpoint + "/emptyAssetData"
    await http.post(url)
    return console.log('Assets Removed')
}

export async function populateDatabase(assets) {
    console.log('== Submitting Base Assets to backend')
    const url = apiEndpoint + "/populateDatabase"
    await http.post(url, {assets})
    return console.log('... chunk added')
}