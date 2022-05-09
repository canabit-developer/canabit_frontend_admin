import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import _ from "lodash"
import {Core} from '@/vuexes/core'
import axios from  '@/plugins/axios'
import {Web} from '@/vuexes/web'
@Module({generateMutationSetters: true})
class AuthModule extends VuexModule {
  private  token:any =  localStorage.getItem('token')
  public user:any = null

  public async setUser(){
    let user = await Core.getHttp(`/api/auth/v2/profile/`)
    this.user = user;
    //this.user.fuck = "sdsdsd"
    return user;
  }


  public async getMyKyc(){
    let kyc = await Core.getHttp(``)
  }

 
  public async getUser(){
    let user = await Core.getHttp(`/api/auth/v2/profile/`)
    return user;
  }

  public async login(form:any){
    await this.reToken();
    let user = await Core.postHttp(`/api/auth/v1/login/`, form)
    return user 
  }

  public async register(form:any){
    await this.reToken();
    let user = await Core.postHttp(`/api/auth/v2/register/`, form)
    return user 
  }



  public async reToken(){
    axios.defaults.headers.common['Authorization'] = '';
  }

  public async storeToken(token:any){
    console.log(token);
    axios.defaults.headers.common['Authorization'] = (token != null )?`Token ${token}`:'';
  }

  public async storeTokenToStorage(token:any){
    localStorage.setItem('token',token )
  }

  public async checkToken(){
    if(this.token != null){
      await this.storeToken(this.token);
    }
  }

  public async checkUser(){
    let user = await this.getUser(); 
    if(this.token){
      if(!user.id){
        alert('Session หมดอายุ')
        await this.reToken();
        await this.logout(); 
        location.reload();
      }
    }
  
    // if(!this.user.id){
    //   await window.location.replace("/auth/login");
    // }
  }


  public async logout(){
    localStorage.clear();
    return await Core.postHttp('/auth/logout/',{})
  }



  public async logPoint(user:number,received_from: string, point: string, types: number, status: number = 0) {
    let form = {
      "received_from": received_from,
      "point": point,
      "type": types,
      "status": status,
      "user": user
    }
    let out = await Core.postHttp(`/api/account/userpointhistory/`, form)
    if (out.id) {
      
    }
  }

  public async cutPoint(user_id:number,point: number) {
    let userPoint:any = await Core.getHttp(`/api/account/userpoint/?user=${user_id}`)
    if(userPoint.length > 0){
      let form = userPoint[userPoint.length -1]
      form.current = Number(form.current) - Number(point)
      let data = await Core.putHttp(`/api/account/userpoint/${userPoint.id}/`, form)
      if(data.id){
        await Web.alert(`ตัด Point ${point}`)
      }
    } 
  }

  public async addPoint(user_id:number,point: number) {
    let userPoint:any = await Core.getHttp(`/api/account/userpoint/?user=${user_id}`)
    if(userPoint.length > 0){
      let form = userPoint[userPoint.length -1]
      form.current = Number(form.current) + Number(point)
    let data = await Core.putHttp(`/api/account/userpoint/${form.id}/`, form)
    if(data.id){
      await Web.alert(`เพิ่ม Point ${point}`)
    }
    } 
  }



}

import store from "@/vuexes" 
export const Auth = new AuthModule({store, name: "Auth"})