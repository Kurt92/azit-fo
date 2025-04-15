// ExpeditionInterface.ts
export interface IExpedition {
    expeditionBossId: string;
    mainCharacterNm: string;
    characterNm: string;
    characterClassName: string;
    itemLevel: string;
    characterLevel: string;
    serverNm: string;
    sixmanAt: boolean | undefined;
    bossList:IBoss[];
    expeditionId:string;
}

export interface IDataItem {
    mainCharacterNm: string;
    // characterClassName: string;
    // itemLevel: string;
    expeditionList: IExpedition[];
}

export interface IBoss {
    bossNm: string;
    gate: string;
    clearAt: boolean;
    clearGold: number;
}