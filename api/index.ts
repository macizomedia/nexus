import Koa from "koa";
import { Server } from "http";
import { createApolloServer } from "./server";
import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();

const httpServer = new Server();
const app = new Koa();

const init = async () => {
	const apolloServer = await createApolloServer(db, httpServer, app);

	app.listen(4000, () => {
		console.log(
			`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
		);
	});
};

init();
