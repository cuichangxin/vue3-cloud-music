import { defineStore } from 'pinia'

export const mainStore = defineStore('main',{
  state:()=>{
    return {
      songData:'',
      atPlayShow:false,
    }
  },
  getters: {
  },
  actions: {
    addSongUrl(data){
      this.songData = data
    }
  },
})