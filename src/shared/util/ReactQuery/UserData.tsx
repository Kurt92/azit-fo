import { useQuery, QueryKey } from "@tanstack/react-query";

export const UserData = <TParam = undefined, TData = unknown>(
    queryKey: QueryKey,
    fetchFunction: (param?: TParam) => Promise<TData>,
    param?: TParam // param은 선택적으로 전달 가능
) => {
    return useQuery<TData>({
        queryKey: param !== undefined ? [queryKey, param] : [queryKey], // param이 있으면 포함
        queryFn: () => fetchFunction(param), // param이 undefined여도 안전하게 처리
        staleTime: 1000 * 60 * 5, // 5분 동안 캐싱
        retry: 1, // 실패 시 한 번 재시도
    });
};
