import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

createApp(App).mount('#app')
