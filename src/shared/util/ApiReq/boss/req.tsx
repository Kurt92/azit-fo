import axios from "axios";

export const sample1 = async (): Promise<{ id: number; name: string }[]> => {
    const response = await axios.get("/api/back/board/sample1", {
        withCredentials: true,
    });
    return response.data; // 반환 데이터를 명확히 타입 지정
};
