import http from './httpService'

const apiEndpoint = '/users'

function userURL(id){
    return `${apiEndpoint}/${id}`
}

export function register(user){
    return http.post(apiEndpoint,  {
        email: user.username,
        password: user.password,
        name: user.name
    })
}

export function saveSettings(user, userSettings){
    const updatedUser = user
    updatedUser['settings'] = userSettings
    if (updatedUser._id) {
        const body = {...updatedUser}
        delete body._id
        return http.put(userURL(updatedUser._id), body);
    }
    else return (console.log('Something went wrong when saving settings.'))
}

export async function getSettings(_id) {
    const url = apiEndpoint + "/getUserSettings/" + _id
    const getUserSettings = await http.get(url);
    if (getUserSettings.data.error) {
        return getUserSettings.data.error;
    } else {
        return getUserSettings.data;
    }
}