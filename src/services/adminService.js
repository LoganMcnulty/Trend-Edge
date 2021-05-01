import http from './httpService'

const apiEndpoint = '/admin'

export async function removeUsers(user) {
    const url = apiEndpoint + "/removeUsers"
    const res = await http.post(url,  {
        user: user
    })
    return res
}