import { Injectable } from '@angular/core';

import {Message} from 'primeng/primeng';

import { deepIndexOf } from '../_utils/array';
export const baseUrl='http://172.27.21.162:5000';
export const frontendUrl='http://172.27.21.162:4200';

//export const baseUrl='http://172.27.21.186:5000';
//export const baseUrl='http://172.27.21.185:5000';




@Injectable()
export class EventBusService {

  constructor() {}
  
  //面包屑数据源
  breadcrumbItems:any[]=[];

  //消息数据源
  msgs: Message[] = [];

  addMsgs(m: any){
    this.msgs = []
    this.msgs.push(m);
  }

  addCrumb(labelstr,urlstr){
    let newc = {label: labelstr, url: urlstr};
    if (this.breadcrumbItems.length > 5){
        this.breadcrumbItems.splice(0,1);
    }
    let index = deepIndexOf(this.breadcrumbItems,{label: labelstr, url: urlstr})
    if (index == -1){
        this.breadcrumbItems.push(newc);
    } else {
      let newc = this.breadcrumbItems[index];
      this.breadcrumbItems.splice(index,1);
      this.breadcrumbItems.push(newc);
    }
  }

}


