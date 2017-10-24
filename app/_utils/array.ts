import { Permission } from '../_domains/role.domain';

//获取对象在对象数组中的索引
export function deepIndexOf(arr, obj) {
    return arr.findIndex(function (cur) {
      return Object.keys(obj).every(function (key) {
        return obj[key] === cur[key];
      });
    });
}

//对象数组之间的差运算,假设对象含id字段
export function minus(arrsp, arrb){
  let result = new Array<any>();
  
  for (let a of arrsp){
    
    let ainb = false;
    for (let b of arrb){
      
      if (a.id == b.id){
        ainb = true;
      }
    }
    if (!ainb){
      result.push(a);
    }
  }

  return result
}