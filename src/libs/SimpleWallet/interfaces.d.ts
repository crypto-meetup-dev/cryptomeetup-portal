export interface SimpleWalletCommonField {
    protocol: string;
    version: string;
    dappName?: string;
    dappIcon?: string;
}
export interface IPay {
    from?: string;
    to: string;
    amount: number;
    contract: string;
    symbol: string;
    precision: number;
    dappData?: string;
    desc?: string;
    expired: number;
    callback?: string;
}
export interface ExportedData {
    action: string;
}
export interface ExportedTransaction extends SimpleWalletCommonField, IPay, ExportedData {
}
export interface ExportedLoginRequest extends SimpleWalletCommonField, ILoginRequest, ExportedData {
}
export interface ILoginRequest {
    uuID: string;
    loginUrl: string;
    expired: number;
    loginMemo?: string;
}
