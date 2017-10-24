import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Company } from '../_domains/company.domain';
import { baseUrl } from '../_services/eventbus.service';
//import { setTokenOptions } from '../_services/authentication.service';

@Injectable()
export class CompanyService {

  constructor(private http: Http) {}

  url = baseUrl+"/api/companys"

  listOnePage(model, sort, page, per_page) {
    let params = new URLSearchParams();
    params.set('companyname', model.companyname);
    params.set('companyiddr', model.companyiddr);
    params.set('legalperson', model.legalperson);
    return this.http.get(this.url + `?page=${page}&per_page=${per_page}&sortfield=${sort.field}&sort=${sort.order}`, {search: params} )
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})           
  }

  add(c: Company): Promise<any>{ 
    let params = new URLSearchParams();
    params.set('companyname', c.companyname);
    params.set('companyiddr', c.companyiddr);
    params.set('legalperson', c.legalperson);
    params.set('bank', c.bank);
    params.set('accountnumber', c.accountnumber);
    params.set('zipcode', c.zipcode);
    params.set('dutyparagraph', c.dutyparagraph);
    params.set('kind', c.kind);
    return this.http.post(this.url,params)
               .map(response => response.json()).toPromise();
  }

  delete(id: any) {
    return this.http.delete(this.url + `/${id}`)
               .toPromise();
  }

  isUpdate = false;
  updateCompany : Company = null;
  
  update(c: Company): Promise<any>{
    let params = new URLSearchParams();
     params.set('companyname', c.companyname);
    params.set('companyiddr', c.companyiddr);
    params.set('legalperson', c.legalperson);
    params.set('bank', c.bank);
    params.set('accountnumber', c.accountnumber);
    params.set('zipcode', c.zipcode);
    params.set('dutyparagraph', c.dutyparagraph);
    params.set('kind', c.kind);
    let id = c.id;
    return this.http.post(this.url + `/${id}`,params)
        .map(response => response.json()).toPromise();
  }

  initUpdate(c: Company){
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
  public getByCompanyname(un: string, id: any): Promise<any>{
    return this.http.get(this.url + `/${un}` + `?id=${id}` + '&isCheck=1')
               .toPromise().catch(this.handleError)
               .then(res => {return res.json()})          
  }
}


