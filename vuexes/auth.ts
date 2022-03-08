import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import _ from "lodash"
import {Core} from '@/vuexes/core'
import axios from  '@/plugins/axios'
@Module({generateMutationSetters: true})
class AuthModule extends VuexModule {
  private  token:any =  localStorage.getItem('token')
  public user:any = null

  public async setUser(){
    let user = await Core.getHttp(`/api/auth/v2/profile/`)
    this.user = user;
    this.user.fuck = "sdsdsd"
    return user;
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







}

import store from "@/vuexes"
export const Auth = new AuthModule({store, name: "Auth"})