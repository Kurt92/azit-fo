import axios from "axios";
import {IUser} from "@/shared/types/UserInterface";

// 여기서 : 이게 들어가는 문법은 타입스크립트 문법으로 리턴값을 지정해주는 문법임
// 따라라서 : 이거 뒤에오는 IUser의 프로미스 타입으로 데이터라 리턴되지 않으면 ide컴파일 에러(빨간줄)이 남. 나긴하지만 런타임에선 됨
// 2025.05.21 현재 넥스트 프록시 호출 방식으로 변경
// 개발시에는 api경로로 자동호출하도록 하였는데, 배포시 엔지넥스 사용과 /api의 api서버 호출의 중복으로 인해 분기처리해야함
export const user = async (): Promise<IUser> => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const apiPath = isDevelopment ? '/api/auth/token' : '/nextapi/auth/token';
    
    const response = await axios.get(apiPath, {
        withCredentials: true,
    });
    return response.data.user; // 반환 데이터를 명확히 타입 지정
};
