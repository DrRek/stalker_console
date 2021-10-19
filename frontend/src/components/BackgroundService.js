import BackgroundService from 'react-native-background-actions';
import deviceStorage from '../services/storage.service';
import Config from "react-native-config";

const axios = require('axios');

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const get_auth_headers = async () => {
  const user = JSON.parse(await deviceStorage.getItem('user'));
  if (user && user.accessToken) {
    return {'x-access-token': user.accessToken};
  } else {
    return {};
  }
};


const handleWebSocket = async () => {
  var ws = new WebSocket('ws://192.168.1.86:8084', null, {
    headers: await get_auth_headers(),
  });
  ws.onopen = () => {
    console.log('connection open');
  };
  ws.onmessage = async ({data}) => {
    const {method, url, rawHeaders, data: postData, id} = JSON.parse(data);
    const headers = {};
    for (let i = 0; i < rawHeaders.length - 1; i += 2) {
      headers[rawHeaders[i]] = rawHeaders[i + 1];
    }
    headers['accept-encoding'] = 'gzip, deflate';
    headers['host'] = 'i.instagram.com';
    const response = await axios.request({
      method: method,
      url: 'https://i.instagram.com' + url,
      data: postData,
      headers: headers,
      decompress: false,
    });

    ws.send(
      JSON.stringify({
        id: id,
        data: response.data,
        headers: response.headers,
        status: response.status,
      }),
    );
  };
  ws.onerror = error => {
    console.log(error);
  };
};

class BService {
  constructor() {
    this.Options = {
      taskName: 'Demo',
      taskTitle: 'Demo Running',
      taskDesc: 'Demo',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      parameters: {
        delay: parseInt(Config.PERIODIC_CHECK),
      },
      actions: '["Exit"]',
    };
  }

  async VeryIntensiveTask(taskDataArguments) {
    const {delay, api} = taskDataArguments;
    while (true) {
      console.log("running periodic check")
      handleWebSocket()
      await api.runPendingJobs();
      await sleep(delay)
    }
  }

  Start(api) {
    this.Options.parameters['api'] = api;
    BackgroundService.start(this.VeryIntensiveTask, this.Options);
  }

  Stop() {
    BackgroundService.stop();
  }
}

const BackgroudService = new BService();
export default BackgroudService;
