import { defineStore } from 'pinia'

export const mainStore = defineStore('main',{
  state:()=>{
    return {
      songData:''
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