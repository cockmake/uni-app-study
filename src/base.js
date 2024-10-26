import {ref} from 'vue';

const contentHeight = ref(800);

// const SERVER_URL = 'http://192.168.140.67:7230';

const SERVER_URL = 'https://www.forwardforever.top';

const API_URL = `${SERVER_URL}/api/v0`;

export {API_URL, contentHeight};