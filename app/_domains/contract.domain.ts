export class Contract {
    id: number;
    contractno: string;
    signdate: string;
    signplace: string;
    totalprice: number;
    firstparty: string;
    secondparty: string;
    audited:boolean;
    details: Array<ContractDetail>;
}

export class ContractDetail {
    id: number;
	product: string;
	model: string;
	productor: string;
	quantity: number;
	unit: string;
	price: number;
	total: number;
	contractno: string;
}