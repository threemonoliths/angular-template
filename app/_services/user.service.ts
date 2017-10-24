import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { User } from '../_domains/user.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class UserService {

  constructor(private http: Http) {}

  url = baseUrl+"/api/users"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('username', model.username);
    params.set('email', model.email);
    params.set('fullname', model.fullname);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c: User): Promise<any>{ 
    let params = new URLSearchParams();
    let ps = JSON.stringify(c.roles);
    params.set('username', c.username);
    params.set('password', c.password);
    params.set('email', c.email);
    params.set('fullname', c.fullname);
    params.set('position', c.position);
    params.set('roles', c.roles ? ps : '[]');
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise();
  }

  delete(id: any) {
    return this.http.delete(this.url + `/${id}`)
               .toPromise();
  }

  isUpdate = false;
  updateUser : User = null;
  
  update(c: User): Promise<any>{
    let params = new URLSearchParams();
    let ps = JSON.stringify(c.roles);
    params.set('username', c.username);
    params.set('password', c.password);
    params.set('email', c.email);
    params.set('fullname', c.fullname);
    params.set('position', c.position);
    params.set('roles', c.roles ? ps : '[]');
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
        .map(response => response.json()).toPromise();
  }

  initUpdate(c: User){
    let id = c.id;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
  }
  
  //http异常处理函数
  private handleError(error: any): Promise<any> {
    console.log(error.status);
    return Promise.reject(error.message || error);
  }

  //验证用户名重复
  public getByUsername(un: string, id: any): Promise<any>{
    return this.http.get(this.url + `/${un}` + `?id=${id}` + '&isCheck=1')
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})          
  }
}


