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
      console.log('123');
      console.log(val);
      this.count++
    }
  },
})