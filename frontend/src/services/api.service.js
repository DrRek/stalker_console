const axios = require("axios")
const deviceStorage = require("./storage.service")

const HOSTNAME = "http://192.168.1.86:8090"

const get_auth_headers = async () => {
    const user = JSON.parse(await deviceStorage.getItem('user'))
    if (user && user.accessToken) {
        return { 'x-access-token': user.accessToken };
    } else {
        return {};
    }
}

const api = {
    async fetchPlatforms() {
        try {
            const response = await axios({
                method: 'get',
                url: `${HOSTNAME}/api/platform/all`
            });
            return response.data
        } catch (e) {
            console.log(e)
        }
    },
    async addPlatformAccount(username, password, platformId) {
        try {
            const response = await axios({
                method: 'post',
                url: `${HOSTNAME}/api/platform_account/add`,
                headers: await get_auth_headers(),
                data: {
                    username,
                    password,
                    platformId
                }
            });
            console.log(response.data)
            return response.data
        } catch (e) {
            console.log(e)
        }
    }
}

export default api;