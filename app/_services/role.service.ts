import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Role,Permission } from '../_domains/role.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class RoleService {

  constructor(private http: Http) {}

  url = baseUrl+"/api/roles"
  
  list() {
    return this.http.get(this.url)
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()["items"]})           
  }

   listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('rolename', model.rolename);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }



  add(c: Role): Promise<any>{ 
    let params = new URLSearchParams();
    let ps = JSON.stringify(c.permissions);
    params.set('rolename', c.rolename);
    params.set('permissions', c.permissions ? ps : '[]');
    console.log(params.get('permissions'));
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise()
               .then(result => {console.log('From Promise:', result);});
  }

  delete(id: any) {
    return this.http.delete(this.url + `/${id}`)
               .toPromise();
  }

  isUpdate = false;
  updateRole : Role = null;
  
  update(c: Role): Promise<any>{
    let params = new URLSearchParams();
    let ps = JSON.stringify(c.permissions);
    params.set('rolename', c.rolename);
    params.set('permissions', c.permissions ? ps : '[]');
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
        .map(response => response.json()).toPromise();
  }

  initUpdate(c: Role){
    let id = c.id;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
  }

  getAllPermissions(): Promise<any>{
    return this.http.get(baseUrl + "/api/permissions").toPromise().then(res => {return res.json()["items"]});
  }
  
  //http异常处理函数
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  //验证角色名重复
  getByRolename(un: string): Promise<any>{
    return this.http.get(this.url + `/${un}`)
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()["items"]})          
  }
}


