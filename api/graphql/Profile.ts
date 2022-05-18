import { objectType, extendType, stringArg, nonNull, intArg } from "nexus";

export const Profile = objectType({
	name: "Profile",
	definition(t) {
		t.int("userId");
		t.string("bio");
		t.string("avatar");
		t.int("points");
		t.string("level");
		t.field("user", {
			type: "User",
			async resolve(parent, _args, ctx) {
				parent.userId ??= 0;
				return ctx.db.user.findUnique({ where: { id: parent.userId } });
			}
		});
	}
});

export const ProfileQuery = extendType({
	type: "Query",
	definition(t) {
		t.field("profile", {
			type: Profile,
			args: {
				userId: nonNull(intArg())
			},
			async resolve(_parent, args, ctx) {
				return ctx.db.profile.findUnique({ where: { userId: args.userId } });
			}
		});
	}
});

export const ProfileMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.field("createProfile", {
			type: Profile,
			args: {
				userId: nonNull(intArg()),
				bio: nonNull(stringArg()),
				avatar: nonNull(stringArg())
			},
			resolve(_parent, args, ctx) {
				const profile = {
					userId: args.userId,
					bio: args.bio,
					avatar: args.avatar
				};
				return ctx.db.profile.create({ data: profile });
			}
		});

		t.field("updateProfile", {
			type: Profile,
			args: {
				userId: nonNull(intArg()),
				bio: nonNull(stringArg()),
				avatar: nonNull(stringArg())
			},
			resolve(_parent, args, ctx) {
				const profile = {
					userId: args.userId,
					bio: args.bio,
					avatar: args.avatar
				};
				return ctx.db.profile.update({
					where: { userId: args.userId },
					data: profile
				});
			}
		});
	}
});
