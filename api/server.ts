// api/server.ts
import { ApolloServer } from "apollo-server-koa";
import Koa from "koa";
import { Server } from "http";
import { schema } from "./schema";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { PrismaClient } from "@prisma/client";

export async function createApolloServer(
	db: PrismaClient,
	httpServer: Server,
	app: Koa
): Promise<ApolloServer> {
	const apolloServer = new ApolloServer({
		csrfPrevention: true,
		schema,
		context: ({ req }) => {
			return { db };
		},
		introspection: true,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
	});

	const corsOptions = { origin: "*", credentials: true };

	await apolloServer.start();
	apolloServer.applyMiddleware({ app, cors: corsOptions });
	return apolloServer;
}
