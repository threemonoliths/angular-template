import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Godownentry, GodownentryDetail } from '../_domains/godownentry';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class GodownentryService {

  constructor(private http: Http) {}

  url = baseUrl+"/api/yprk"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('BillNo', model.BillNo);
    params.set('Contractno', model.Contractno);
    params.set('Supplier', model.Supplier);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c:Godownentry): Promise<any>{ 
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('BillNo',c.BillNo);
    params.set('Contractno',c.Contractno);
    params.set('Supplier',c.Supplier);
   
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
  updateGodownentry : Godownentry = null;
  //获取合同对象将提供给修改页面Form使用
  initUpdate(c: Godownentry){
    let id = c.id;
    this.updateGodownentry = c;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
               //.then(result => this.updateContract.detail = result); 
  }

  update(c: Godownentry): Promise<any>{
    let details = JSON.stringify(this.parseDetails(c.details));
    let params = new URLSearchParams();
    params.set('BillNo',c.BillNo);
    params.set('Contractno',c.Contractno);
    params.set('Supplier',c.Supplier);
   
  params.set('details',details);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
               .map(response => response.json()).toPromise();
  }
   
   //过滤掉没有填写产品名称的明细
   parseDetails(ds: Array<GodownentryDetail>) : any {
     let results = new Array<GodownentryDetail>();
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


  public getByBillNo(un: string, id: any): Promise<any>{
    return this.http.get(this.url + `/${un}` + `?id=${id}` + '&isCheck=1')
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})          
  }
}