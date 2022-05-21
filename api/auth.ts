import { Request } from "koa";
import jwt from "jsonwebtoken";

export const parseBearer = (bearer: string) => {
	const [_, token] = bearer.trim().split(" ");
	return token;
};

export const getMe = async (req: Request) => {
	const bearer = req.headers["Authorization"];
	const token = bearer?.slice("bearer".length);
	if (!token) {
		return null;
	}
	if (typeof token !== "string") {
		throw new Error("Invalid token");
	}
	const user = jwt.verify(token, "secret");
	return user;
};
