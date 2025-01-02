// ExpeditionInterface.ts
export interface Expedition {
    accountId: string;
    mainCharacterNm: string;
    characterNm: string;
    characterClassName: string;
    itemLevel: string;
    characterLevel: string;
    serverNm: string;
    sixmanAt: string | null;
}

export interface DataItem {
    mainCharacterNm: string;
    // characterClassName: string;
    // itemLevel: string;
    expeditionList: Expedition[];
}
