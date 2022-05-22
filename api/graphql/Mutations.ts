import {
	inputObjectType,
	extendType,
	nonNull,
	stringArg,
	intArg,
	list
} from "nexus";
import { DateTime } from "../../types/DateTime";

import { activityStatus, activityType } from "./Activity";

import { challengeType } from "./Challenge";

/**
 *
 * InputsTypes
 *
 */

export const ProfileInputType = inputObjectType({
	name: "ProfileInput",

	definition(t) {
		t.nonNull.string("bio");
		t.nonNull.string("avatar");
		t.nonNull.int("points");
		t.nonNull.string("level");
	}
});

export const InteractionInputType = inputObjectType({
	name: "InteractionInput",

	definition(t) {
		t.nonNull.int("userId");
		t.nonNull.int("activityId");
		t.nonNull.int("timeouts");
	}
});

export const ChallengeInputType = inputObjectType({
	name: "ChallengeInput",

	definition(t) {
		t.nonNull.int("id");
		t.nonNull.string("title");
		t.nonNull.string("description");

		t.field("startDate", { type: "DateTime" });
		t.field("endDate", { type: "DateTime" });

		t.field("createdAt", { type: "DateTime" });
		t.field("updatedAt", { type: "DateTime" });
		t.int("timeouts");
	}
});

export const ActivityInputType = inputObjectType({
	name: "ActivityInput",

	definition(t) {
		t.nonNull.int("id");
		t.nonNull.string("title");
		t.nonNull.string("description");
		t.field("type", { type: activityType });
		t.field("status", { type: activityStatus });
		t.field("createdAt", { type: "DateTime" });
		t.field("updatedAt", { type: "DateTime" });
		t.int("timeouts");
	}
});

/**
 * User Mutations
 * @param t
 * @param ctx
 * @param args
 * @param info
 *
 * @returns {Promise<*>}
 */

export const userMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.field("createUser", {
			type: "User",
			args: {
				email: nonNull(stringArg()),
				name: nonNull(stringArg()),
				token: nonNull(stringArg())
			},
			resolve(_parent, args, ctx) {
				const user = {
					email: args.email,
					name: args.name,
					token: args.token
				};
				return ctx.db.user.create({ data: user });
			}
		});

		t.field("createUserWithProfile", {
			type: "User",
			args: {
				email: nonNull(stringArg()),
				name: nonNull(stringArg()),
				token: nonNull(stringArg()),
				profile: nonNull(ProfileInputType)
			},
			resolve(_parent, args, ctx) {
				const user = {
					email: args.email,
					name: args.name,
					token: args.token
				};
				const profile = {
					bio: args.profile.bio,
					avatar: args.profile.avatar,
					points: args.profile.points,
					level: args.profile.level
				};
				return ctx.db.user.create({
					data: {
						...user,
						profile: {
							create: {
								avatar: profile.avatar,
								bio: profile.bio,
								points: profile.points,
								level: profile.level
							}
						}
					}
				});
			}
		});

		t.field("updateUser", {
			type: "User",
			args: {
				id: nonNull(intArg()),
				email: nonNull(stringArg()),
				name: nonNull(stringArg())
			},
			resolve(_parent, args, ctx) {
				const user = {
					email: args.email,
					name: args.name
				};
				return ctx.db.user.update({ where: { id: args.id }, data: user });
			}
		});

		t.field("newInteraction", {
			type: "User",
			args: {
				userId: nonNull(intArg()),
				activityId: nonNull(intArg())
			},
			resolve(_parent, args, ctx) {
				const interaction = {
					userId: args.userId,
					activityId: args.activityId,
					timeouts: 60000000
				};
				return ctx.db.interaction.create({
					data: interaction
				});
			}
		});

		t.field("updateUserPoints", {
			type: "User",
			args: {
				userId: nonNull(intArg()),
				points: nonNull(intArg())
			},
			resolve(_parent, args, ctx) {
				const user = {
					points: args.points
				};
				return ctx.db.user.update({ where: { id: args.userId }, data: user });
			}
		});

		t.field("updateUserProfile", {
			type: "Profile",
			args: {
				id: nonNull(intArg()),
				bio: nonNull(stringArg()),
				avatar: nonNull(stringArg()),
				points: nonNull(intArg()),
				level: nonNull(stringArg())
			},
			resolve(_parent, args, ctx) {
				const profile = {
					bio: args.bio,
					avatar: args.avatar,
					points: args.points,
					level: args.level,
					User: {
						connect: {
							id: args.id
						}
					}
				};
				return ctx.db.profile.upsert({
					where: {
						userId: args.id
					},
					update: {
						bio: args.bio,
						avatar: args.avatar,
						points: args.points,
						level: args.level
					},
					create: profile
				});
			}
		});

		t.field("deleteUser", {
			type: "User",
			args: {
				id: nonNull(intArg())
			},
			resolve(_parent, args, ctx) {
				return ctx.db.user.delete({ where: { id: args.id } });
			}
		});
	}
});

/**
 * Activity Mutations
 * @macizomedia
 * path: api/graphql/Activity.ts
 * args: {
 * id: int,
 * title: string,
 * createdAt: DateTime,
 * updatedAt: DateTime,
 * timeouts: int,
 * challenge: Challenge,
 * interactions: [Interaction]
 * }
 */

export const ActivityMutation = extendType({
	type: "Mutation",

	definition(t) {
		t.field("createActivity", {
			type: "Activity",
			args: {
				type: nonNull(activityType),
				title: nonNull(stringArg()),
				description: nonNull(stringArg()),
				startDate: nonNull(stringArg()),
				endDate: nonNull(stringArg()),
				challenge: nonNull(intArg()),
				points: nonNull(intArg())
			},
			resolve(_parent, args, ctx) {
				const activity = {
					title: args.title,
					type: args.type,
					description: args.description,
					startDate: args.startDate,
					endDate: args.endDate,
					points: args.points
				};
				return ctx.db.activity.create({
					data: {
						...activity,
						Challenge: {
							connect: {
								id: args.challenge
							}
						}
					}
				});
			}
		});

		t.field("updateActivityStatus", {
			type: "Activity",
			args: {
				id: nonNull(intArg()),
				status: nonNull(activityStatus)
			},
			resolve(_parent, args, ctx) {
				const activity = {
					status: args.status
				};
				return ctx.db.activity.update({
					where: { id: args.id },
					data: activity
				});
			}
		});

		t.field("deleteActivity", {
			type: "Activity",
			args: {
				id: nonNull(intArg())
			},
			resolve(_parent, args, ctx) {
				return ctx.db.activity.delete({ where: { id: args.id } });
			}
		});
	}
});

/**
 * Challenge Mutations
 * @macizomedia
 * path: api/graphql/Challenge.ts
 * args: {
 * id: int,
 * title: string,
 * createdAt: DateTime,
 * updatedAt: DateTime,
 * timeouts: int,
 * activities: [Activity]
 * }
 *
 */

export const ChallengeMutation = extendType({
	type: "Mutation",

	definition(t) {
		t.field("createChallenge", {
			type: "Challenge",
			args: {
				title: nonNull(stringArg()),
				type: nonNull(challengeType),
				description: nonNull(stringArg()),
				startDate: nonNull(stringArg()),
				endDate: nonNull(stringArg())
			},
			resolve(_parent, args, ctx) {
				const challenge = {
					title: args.title,
					description: args.description,
					startDate: args.startDate,
					endDate: args.endDate,
					type: args.type
				};
				return ctx.db.challenge.create({ data: challenge });
			}
		});

		t.field("addActivityToChallenge", {
			type: "Challenge",
			args: {
				challengeId: nonNull(intArg()),
				activityId: nonNull(intArg())
			},
			resolve(_parent, args, ctx) {
				const activity = {
					activities: {
						connect: {
							id: args.activityId
						}
					}
				};
				return ctx.db.challenge.update({
					where: { id: args.activityId },
					data: activity
				});
			}
		});

		t.field("updateChallenge", {
			type: "Challenge",
			args: {
				id: nonNull(intArg()),
				title: nonNull(stringArg()),
				activities: nonNull(ActivityInputType)
			},
			resolve(_parent, args, ctx) {
				const challenge = {
					title: args.title,
					activities: {
						connect: args.activities
					}
				};
				return ctx.db.challenge.update({
					where: { id: args.id },
					data: challenge
				});
			}
		});

		t.field("deleteChallenge", {
			type: "Challenge",
			args: {
				id: nonNull(intArg())
			},
			resolve(_parent, args, ctx) {
				return ctx.db.challenge.delete({ where: { id: args.id } });
			}
		});
	}
});
