import axios from "axios";
import {IUser} from "@/shared/types/UserInterface";

// 여기서 : 이게 들어가는 문법은 타입스크립트 문법으로 리턴값을 지정해주는 문법임
// 따라라서 : 이거 뒤에오는 IUser의 프로미스 타입으로 데이터라 리턴되지 않으면 ide컴파일 에러(빨간줄)이 남. 나긴하지만 런타임에선 됨
export const user = async (): Promise<IUser> => {
    const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
    const response = await axios.get(`${authDomain}/token`, {
        withCredentials: true,
    });
    return response.data.user; // 반환 데이터를 명확히 타입 지정
};
