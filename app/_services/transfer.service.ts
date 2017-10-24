import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Transfer, TransferDetail } from '../_domains/transfer.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class TransferService {

  constructor(private http: Http) {}

  url = baseUrl+"/api/transfer"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('billno', model.billno);
    params.set('date', model.date);
    params.set('stockplace', model.stockplace);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c: Transfer): Promise<any>{ 
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('billno', c.billno);
    params.set('date', c.date);
    params.set('stockplace', c.stockplace);
    params.set('dispatcher', c.dispatcher);
    params.set('stockman', c.stockman);
    params.set('accountingclerk', c.accountingclerk);
    params.set('entryperson', c.entryperson);
    params.set('auditperson', c.auditperson);
    params.set('state', c.state);
    params.set('auditdate', c.auditdate);
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
  updateTransfer : Transfer = null;
  //获取调拨单号对象将提供给修改页面Form使用
  initUpdate(c: Transfer){
    let id = c.id;
    this.updateTransfer = c;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
               //.then(result => this.updateContract.detail = result); 
  }

  update(c: Transfer): Promise<any>{
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('billno', c.billno);
    params.set('date', c.date);
    params.set('stockplace', c.stockplace);
    params.set('dispatcher', c.dispatcher);
    params.set('stockman', c.stockman);
    params.set('accountingclerk', c.accountingclerk);
    params.set('entryperson', c.entryperson);
    params.set('auditperson', c.auditperson);
    params.set('state', c.state);
    params.set('auditdate', c.auditdate);
    params.set('details', details);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
               .map(response => response.json()).toPromise();
  }
   
   //过滤掉没有填写调拨单号的明细
   parseDetails(ds: Array<TransferDetail>) : any {
     let results = new Array<TransferDetail>();
     for ( let d of ds){
       if (d.billno!=null) {
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