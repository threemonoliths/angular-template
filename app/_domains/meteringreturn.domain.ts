export class MeteringReturn {
    id: number;
    billno: string;
    billdate: string;
    stockman: string;
    accountingclerk:string;
    details: Array<MeteringReturnDetail>;
}

export class MeteringReturnDetail {
    id: number;
    billno:string;
    wagonno: string;
    cardno:string;
	oilname: string;
	unit: string;
	quantity: number;
	stockplace: number;
	comment: string;
}