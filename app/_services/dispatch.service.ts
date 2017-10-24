import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Dispatch, DispatchDetail } from '../_domains/dispatch.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class DispatchService {

  constructor(private http: Http) {}

  url = baseUrl+"/api/dispatchs"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('billno', model.billno);
    params.set('date', model.date);
    params.set('purchaser', model.purchaser);
    params.set('stockplace', model.stockplace);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c: Dispatch): Promise<any>{ 
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('billno', c.billno);
    params.set('date', c.date);
    params.set('purchaser', c.purchaser);
    params.set('stockplace', c.stockplace);
    params.set('quantity', c.quantity? String(c.quantity) : '0');
    params.set('total', c.total? String(c.total) : '0');
    params.set('dispatcher', c.dispatcher);
    params.set('stockman', c.stockman);
    params.set('accountingclerk', c.accountingclerk);
    params.set('details', details);
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise();
  }           

  delete(id: any) {

    return this.http.delete(this.url + `/${id}`)
               .toPromise();
  }

  isUpdate = false;
  isAudit = false;
  updateDispatch : Dispatch = null;
//获取合同对象将提供给修改页面Form使用
  initUpdate(c: Dispatch){
    let id = c.id;
    this.updateDispatch = c;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
               //.then(result => this.updateContract.detail = result); 
  }

  update(c: Dispatch): Promise<any>{
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('billno', c.billno);
    params.set('date', c.date);
    params.set('purchaser', c.purchaser);
    params.set('stockplace', c.stockplace);
    params.set('quantity', c.quantity? String(c.quantity) : '0');
    params.set('total', c.total? String(c.total) : '0');
    params.set('dispatcher', c.dispatcher);
    params.set('stockman', c.stockman);
    params.set('accountingclerk', c.accountingclerk);
    params.set('details', details);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
               .map(response => response.json()).toPromise();
  }
   
   //过滤掉没有填写产品名称的明细
   parseDetails(ds: Array<DispatchDetail>) : any {
     let results = new Array<DispatchDetail>();
     for ( let d of ds){
       if (d.oilname!=null) {
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