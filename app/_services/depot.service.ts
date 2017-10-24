import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Depot } from '../_domains/depot.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class DepotService {

  constructor(private http: Http) {}

  url = baseUrl+"/api/depots"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('DepotName', model.DepotName);
    params.set('OilName', model.OilName);
    params.set('DepotIDDR', model.DepotIDDR);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c: Depot): Promise<any>{ 
    let params = new URLSearchParams();
   
    params.set('DepotName', c.DepotName);
    params.set('OilName', c.OilName);
    params.set('DepotIDDR', c.DepotIDDR);
    params.set('Kind', c.Kind);
    params.set('Company_Id', c.Company_Id ? String(c.Company_Id) : '0');
    console.log(params)
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise();
  }

  delete(id: any) {
    return this.http.delete(this.url + `/${id}`)
               .toPromise();
  }

  isUpdate = false;
  updateDepot : Depot = null;
  
  update(c: Depot): Promise<any>{
    let params = new URLSearchParams();
   
     params.set('DepotName', c.DepotName);
    params.set('OilName', c.OilName);
    params.set('DepotIDDR', c.DepotIDDR);
    params.set('Kind', c.Kind);
    params.set('Company_Id', c.Company_Id ? String(c.Company_Id) : '0');
    
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
        .map(response => response.json()).toPromise();
  }

  initUpdate(c: Depot){
    let id = c.id;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
  }
  
  //http异常处理函数
  private handleError(error: any): Promise<any> {
    console.log(error.status);
    return Promise.reject(error.message || error);
  }

  //验证仓库名称重复
  public getByDepotname(un: string, id: any): Promise<any>{
    return this.http.get(this.url + `/${un}` + `?id=${id}` + '&isCheck=1')
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})          
  }
}


