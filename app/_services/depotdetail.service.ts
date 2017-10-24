import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { DepotDetail } from '../_domains/depotdetail.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class DepotDetailService {

  constructor(private http: Http) {}

  url = baseUrl+"/api/depotDetails"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('FromTableName', model.FromTableName);
    params.set('Date', model.Date);
    params.set('State', model.State);
    params.set('Seqn', model.Seqn);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c: DepotDetail): Promise<any>{ 
    let params = new URLSearchParams();
    params.set('FromTableName', c.FromTableName);
    params.set('FromColumnName', c.FromColumnName);
    params.set('BillNo', c.BillNo);
    params.set('Seqn', c.Seqn);
    params.set('Amount', c.Amount ? String(c.Amount) : '0');
    params.set('Kind', c.Kind ? String(c.Kind) : '0');
    params.set('Date', c.Date);
    params.set('Depot', c.Depot ? String(c.Depot) : '0');
    params.set('State', c.State );
    params.set('Comment', c.Comment);
    params.set('Class', c.Class);
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise();
  }

  delete(id: any) {
    return this.http.delete(this.url + `/${id}`)
               .toPromise();
  }

  isUpdate = false;
  updateDepotDetail : DepotDetail = null;
  
  update(c: DepotDetail): Promise<any>{
    let params = new URLSearchParams();
     params.set('FromTableName', c.FromTableName);
    params.set('FromColumnName', c.FromColumnName);
    params.set('BillNo', c.BillNo);
    params.set('Seqn', c.Seqn);
    params.set('Amount', c.Amount ? String(c.Amount) : '0');
    params.set('Kind', c.Kind ? String(c.Kind) : '0');
    params.set('Date', c.Date);
    params.set('Depot', c.Depot ? String(c.Depot) : '0');
    params.set('State', c.State );
    params.set('Comment', c.Comment);
    params.set('Class', c.Class);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
        .map(response => response.json()).toPromise();
  }

  initUpdate(c: DepotDetail){
    let id = c.id;
    return this.http.get(this.url + `/${id}`)
               .map(response => response.json()).toPromise();
  }
  
  //http异常处理函数
  private handleError(error: any): Promise<any> {
    console.log(error.status);
    return Promise.reject(error.message || error);
  }

  //验证公司名称重复
  public getByFromtableName(un: string, id: any): Promise<any>{
    return this.http.get(this.url + `/${un}` + `?id=${id}` + '&isCheck=1')
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})          
  }
}


