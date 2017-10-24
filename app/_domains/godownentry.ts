export class Godownentry {
    id: number;
   BillNo:string;
    Supplier:string ;
    Contractno:string ;
    details: Array<GodownentryDetail>;
}

export class GodownentryDetail {
    id: number;
   
    Oilname:string;
    Planquantity:number;
    Realquantity:number;
    Price:number;
    Total:number;
    Stockplace:number;
    Buyer:string ;
    Examiner:string ;
    Accountingclerk:string ;
    Comment:string ;

}