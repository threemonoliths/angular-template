export class Sellpickup {
    companyname:string;
    date:string;
    responsibleperson:string;
    auditor:string;
    operator:string;
    id:number;
   details: Array<SellpickupDetail>;
}

export class SellpickupDetail {
    stockcompany:string;
    variety:string;
    lastt:number;
    lLastl:number;
    stockt:number;
    stockl:number;
   monthpickupt:number;
   monthpickupl:number;
  monthstockt:number;
  monthstockl:number;
   id:number;
   sellpickup:string ;



}