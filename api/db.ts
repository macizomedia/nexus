import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

/* export interface Post {
	id: number;
	title: string;
	body: string;
	published: boolean;
}

export interface Db {
	posts: Post[];
}

export const db: Db = {
	posts: []
};
 */
