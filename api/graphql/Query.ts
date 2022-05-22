import { extendType, intArg, nonNull } from "nexus";

export const userQuery = extendType({
	type: "Query",
	definition(t) {
		t.field("user", {
			type: "User",
			args: {
				id: nonNull(intArg())
			},
			resolve(_root, args, ctx) {
				return ctx.db.user.findUnique({
					where: { id: args.id },
					include: { profile: true, posts: true, interactions: true }
				});
			}
		});
	}
});

export const activityQuery = extendType({
	type: "Query",
	definition(t) {
		t.field("activity", {
			type: "Activity",
			args: {
				id: nonNull(intArg())
			},
			resolve(_root, args, ctx) {
				return ctx.db.activity.findUnique({
					where: { id: args.id },
					include: {
						interactions: true
					}
				});
			}
		});
	}
});

export const challengeQuery = extendType({
	type: "Query",

	definition(t) {
		t.field("challenge", {
			type: "Challenge",
			args: {
				id: nonNull(intArg())
			},
			resolve(_root, args, ctx) {
				return ctx.db.challenge.findUnique({
					where: { id: args.id },
					include: {
						activities: true
					}
				});
			}
		});
	}
});

export const interactionsQuery = extendType({
	type: "Query",
	definition(t) {
		t.field("interactions", {
			type: "Interaction",
			args: {
				id: nonNull(intArg())
			},
			resolve(_root, args, ctx) {
				return ctx.db.interaction.findUnique({
					where: { id: args.id },
					include: { user: true, Activity: true }
				});
			}
		});
	}
});
