import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Sellpickup, SellpickupDetail } from '../_domains/sellpickup';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class SellpickupService {

  constructor(private http: Http) {}

  url =  baseUrl +"/api/sellpickups"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('companyname', model.companyname);
    params.set('date', model.date);
    params.set('responsbleperson', model.responsbleperson);
    params.set('auditor',model.auditor);
    params.set('operator',model.operator);

    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c:Sellpickup): Promise<any>{ 
    
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('companyname',c.companyname);
    params.set('date',c.date);
    params.set('responsibleperson',c.responsibleperson);
    params.set('auditor',c.auditor);
    params.set('operator',c.operator);
    
    params.set('details',details);
    console.log(details);
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise();
  }

  delete(id: any) {

    return this.http.delete(this.url + `/${id}`)
               .toPromise();
  }

  isUpdate = false;
  updateSellpickup : Sellpickup = null;
  //获取合同对象将提供给修改页面Form使用
  initUpdate(c:Sellpickup){
    let id = c.id;
    this.updateSellpickup = c;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
               //.then(result => this.updateContract.detail = result); 
  }

  update(c: Sellpickup): Promise<any>{
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('companyname',c.companyname);
    params.set('date',c.date);
    params.set('responsibleperson',c.responsibleperson);
    params.set('auditor',c.auditor);
    params.set('operator',c.operator);
    params.set('details',details);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
               .map(response => response.json()).toPromise();
  }
   
   //过滤掉没有填写产品名称的明细
   parseDetails(ds: Array<SellpickupDetail>) : any {
     let results = new Array<SellpickupDetail>();
     for ( let d of ds){
       if (d.id!=null) {
         results.push(d);
       }
     }
     return results;
   }
  
  //http异常处理函数
  private handleError(error: any): Promise<any> {
    console.log(error.status);
    //console.log('进入handleError函数');
    //console.log(this.listErrSubj);
    //this.listErrSubj.next(error.message);
    return Promise.reject(error.message || error);
  }
}