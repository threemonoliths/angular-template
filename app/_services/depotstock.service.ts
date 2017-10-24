import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Depotstock} from '../_domains/depotstock.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';



@Injectable()
export class  DepotstockService {

  constructor(private http: Http) {}
   url = baseUrl+"/api/depotstocks"

  
  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('OilName', model.OilName);
    params.set('DepotDate', model.DepotDate);
    params.set('Amount', model.Amount);
    params.set('DepotName', model.DepotName);
    return this.http.get(this.url+ `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  

  add(c: Depotstock): Promise<any>{ 
    let params = new URLSearchParams();
    params.set('OilName', c.OilName);
    params.set('DepotDate', c.DepotDate);
    params.set('Amount', c.Amount ? String(c.Amount) : '0');
    params.set('DepotName', c.DepotName);
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise();
  }

  delete(id: any) {
    return this.http.delete(this.url+ `/${id}`)
               .toPromise();
  }

  isUpdate = false;
  updateDepotstock :Depotstock = null;
  
  update(c: Depotstock): Promise<any>{
    let params = new URLSearchParams();
    params.set('OilName', c.OilName);
    params.set('DepotDate', c.DepotDate);
    params.set('Amount', c.Amount ? String(c.Amount) : '0');
     params.set('DepotName', c.DepotName);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
        .map(response => response.json()).toPromise();
  }

  initUpdate(c:Depotstock){
    console.log(c);
    let id = c.id;
    return this.http.get(this.url+ `/${id}`)
               .map(response => response.json()).toPromise();
  }
  
  //http异常处理函数
  private handleError(error: any): Promise<any> {
    console.log(error.status);
    return Promise.reject(error.message || error);
  }

  
  //验证编码重复
  public getByCode(un: string, id: any): Promise<any>{
    return this.http.get(this.url + `/${un}` + `?id=${id}` + '&isCheck=1')
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})          
  }
}


