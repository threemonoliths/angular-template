import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { MeteringReturn,MeteringReturnDetail  } from '../_domains/meteringreturn.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';



@Injectable()
export class MeteringReturnService {

  constructor(private http: Http) {}
    url = baseUrl+"/api/meteringreturns"
  
  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('billno', model.billno);
    params.set('billdate', model.billdate);
    params.set('stockman', model.stockman);
     params.set('accountingclerk', model.accountingclerk);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }


  add(c: MeteringReturn): Promise<any>{ 
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('billno', c.billno);
    params.set('billdate', c.billdate);
    params.set('stockman', c.stockman);
    params.set('accountingclerk', c.accountingclerk);
     params.set('details', details);
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise();
               
  }

  delete(id: any) {
    return this.http.delete(this.url+ `/${id}`)
               .toPromise();
  }


  isUpdate = false;
   isAudit = false;
  updateMeteringReturn : MeteringReturn = null;
  //获取回罐单明细信息
  initUpdate(c: MeteringReturn){
    let id = c.id;
    this.updateMeteringReturn = c;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
              // .then(result => this.updateMeteringReturn.detail = result); 
  }
  update(c: MeteringReturn): Promise<any>{
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('billno',c.billno);
    params.set('billdate', c.billdate);
    params.set('stockman', c.stockman);
    params.set('accountingclerk', c.accountingclerk);
    params.set('details', details);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
        .map(response => response.json()).toPromise();
        
  }

  
//过滤掉没有填写回罐车号的明细
   parseDetails(ds: Array<MeteringReturnDetail>) : any {
     let results = new Array<MeteringReturnDetail>();
     for ( let d of ds){
       if (d.wagonno!=null) {
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
