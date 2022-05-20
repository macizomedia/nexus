import { db } from "./db";
import { PrismaClient } from "@prisma/client";

export interface Context {
	db: PrismaClient;
	request: {
		request: {
			headers: {
				authorization: string;
			};
		};
		connection: {
			context: {
				Authorization: string;
			};
		};
	};
}

export const context = {
	db
};
