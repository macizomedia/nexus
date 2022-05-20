// api/server.ts
import { ApolloServer } from "apollo-server-koa";
import Koa from "koa";
import { Server } from "http";
import { schema } from "./schema";
import { context } from "./context";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

export async function createApolloServer(
	httpServer: Server,
	app: Koa
): Promise<ApolloServer> {
	const apolloServer = new ApolloServer({
		schema,
		context,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app });
	return apolloServer;
}
