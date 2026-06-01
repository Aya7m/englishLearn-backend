import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "src/auth/types/jwt-payload.type";

export const currentUser=createParamDecorator(
    (data:unknown,context:ExecutionContext):JwtPayload =>{
        const request=context.switchToHttp().getRequest();
        return request.user;
    },
)