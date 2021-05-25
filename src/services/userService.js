import http from './httpService'

const apiEndpoint = '/users'

function userURL(_id){
    return `${apiEndpoint}/${_id}`
}

export function register(user){
    return http.post(apiEndpoint,  {
        email: user.username,
        password: user.password,
        name: user.name
    })
}

export async function saveSettings(_id, update, type, dataType=''){
    if (type === 'watchlistAdd'){
        var data = update
        if (!dataType) data = update[update.length -1]
        console.log('watchlist update: ' + data)
        await http.post(`/data/`, {data, type, dataType}).then(res => console.log(res))
    }

    const url = `${userURL(_id)}/${type}`
    console.log(url)
    return http.put(url, update).then(res => console.log(res));
}

export async function getUser(_id) {
    const url = apiEndpoint + "/getUser/" + _id
    const getUserSettings = await http.get(url);
    if (getUserSettings.data.error) {
        return getUserSettings.data.error;
    } else {
        return getUserSettings.data;
    }
}
