import axios from "axios";

export const user = async (): Promise<{ id: number; name: string }[]> => {
    const response = await axios.get("/api/auth/token", {
        withCredentials: true,
    });
    return response.data.user; // 반환 데이터를 명확히 타입 지정
};
