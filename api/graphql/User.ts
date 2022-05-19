import {
	objectType,
	extendType,
	stringArg,
	nonNull,
	intArg,
	inputObjectType
} from "nexus";

export const User = objectType({
	name: "User",
	definition(t) {
		t.int("id");
		t.string("email");
		t.string("name");
		t.field("profile", {
			type: "Profile",
			async resolve(parent, _args, ctx) {
				parent.id ??= 0;
				return ctx.db.profile.findUnique({ where: { userId: parent.id } });
			}
		});
		t.list.field("posts", {
			type: "Post",
			async resolve(parent, _args, ctx) {
				return ctx.db.post.findMany({ where: { authorId: parent.id } });
			}
		});
	}
});

export const ProfileInputType = inputObjectType({
	name: "ProfileInput",

	definition(t) {
		t.nonNull.int("userId");
		t.nonNull.string("bio");
		t.nonNull.string("avatar");
		t.nonNull.int("points");
		t.nonNull.string("level");
	}
});

export const userQuery = extendType({
	type: "Query",
	definition(t) {
		t.field("id", {
			type: "User",
			args: {
				id: nonNull(intArg())
			},
			async resolve(_parent, args, ctx) {
				return ctx.db.user.findUnique({
					where: { id: args.id },
					include: { profile: true }
				});
			}
		});
	}
});

export const userMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.field("createUser", {
			type: User,
			args: {
				email: nonNull(stringArg()),
				name: nonNull(stringArg())
			},
			resolve(_parent, args, ctx) {
				const user = {
					email: args.email,
					name: args.name
				};
				return ctx.db.user.create({ data: user });
			}
		});

		t.field("createUserWithProfile", {
			type: User,
			args: {
				id: nonNull(intArg()),
				email: nonNull(stringArg()),
				name: nonNull(stringArg()),
				profile: nonNull(ProfileInputType)
			},
			resolve(_parent, args, ctx) {
				const user = {
					email: args.email,
					name: args.name
				};
				const profile = {
					userId: args.id,
					bio: args.profile.bio,
					avatar: args.profile.avatar,
					points: args.profile.points,
					level: "Beginner"
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
			type: User,
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
					UserId: args.id,
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
					create: {
						...profile
					},
					include: {
						User: true
					}
				});
			}
		});

		t.field("deleteUser", {
			type: User,
			args: {
				id: nonNull(intArg())
			},
			resolve(_parent, args, ctx) {
				return ctx.db.user.delete({ where: { id: args.id } });
			}
		});
	}
});
