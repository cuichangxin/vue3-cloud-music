import { defineStore } from 'pinia'

export const mainStore = defineStore('main',{
  state:()=>{
    return {
      msg:'Hello world!',
      count:0
    }
  },
  getters: {
  },
  actions: {
    changeC(val){
      this.count++
    }
  },
})