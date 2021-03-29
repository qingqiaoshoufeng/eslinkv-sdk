import Vue from 'vue'
import Highlight from './highlight'
import * as filters from './filter'

Vue.use(Highlight)
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))
