import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Contract, ContractDetail } from '../_domains/contract.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class ContractService {

  constructor(private http: Http) {}
   
  url = baseUrl+"/api/contracts"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('contractno', model.contractno);
    params.set('signdate', model.signdate);
    params.set('secondparty', model.secondparty);
    params.set('audited',model.audited);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c: Contract): Promise<any>{ 
    
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('contractno', c.contractno);
    params.set('signdate', c.signdate);
    params.set('signplace', c.signplace);
    params.set('totalprice', c.totalprice ? String(c.totalprice) : '0');
    params.set('firstparty', c.firstparty);
    params.set('secondparty', c.secondparty);
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
  updateContract : Contract = null;
  //获取合同对象将提供给修改页面Form使用
  initUpdate(c: Contract){
    let id = c.id;
    this.updateContract = c;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
               //.then(result => this.updateContract.detail = result); 
  }

  update(c: Contract): Promise<any>{
    //this.isAudit=false;
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('contractno', c.contractno);
    params.set('signdate', c.signdate);
    params.set('signplace', c.signplace);
    params.set('totalprice', c.totalprice ? String(c.totalprice) : '0');
    params.set('firstparty', c.firstparty);
    params.set('secondparty', c.secondparty);
    params.set('details', details);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
               .map(response => response.json()).toPromise();
              
   
  }
   
   //过滤掉没有填写产品名称的明细
   parseDetails(ds: Array<ContractDetail>) : any {
     let results = new Array<ContractDetail>();
     for ( let d of ds){
       if (d.product!=null) {
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