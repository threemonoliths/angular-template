export class Transfer{
    id:number;
    billno:string;
    date:string;
    stockplace:string;
    dispatcher:string;
    stockman:string;
    accountingclerk:string;
    entryperson:string;
    auditperson:string;
    state:string;
    auditdate:string;

    details: Array<TransferDetail>;

}
    export class TransferDetail{
        id:number;
        billno:string;
        stockpalce:string;
        unit:string;
        startdegree:number;
        enddegree:number;
        quantity:number;
        confirmation:string;
    }