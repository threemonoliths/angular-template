
export class Dispatch {
    id: number;
    billno: string;
    date: string;
    purchaser: string;
    stockplace: string;
    quantity: number;
    total: number;
    dispatcher:string;
    stockman:string;
    accountingclerk:string;
    details: Array<DispatchDetail>;
}

export class DispatchDetail {
    id: number;
	oilname: string;
	unit: string;
	startdegree: number;
	enddegree: number;
	quantity: number;
	confirmation:string;
	billno: string ;
}