import { SimpleWalletCommonField, ExportedTransaction, IPay, ILoginRequest, ExportedLoginRequest } from "./interfaces";
export default class SimpleWalletApp {
    dappName: string;
    dappIcon: string;
    commonField: SimpleWalletCommonField;
    constructor(dappName: string, dappIcon?: string);
    pay(params: IPay): ExportedTransaction;
    transfer(params: IPay): ExportedTransaction;
    login(params: ILoginRequest): ExportedLoginRequest;
}
