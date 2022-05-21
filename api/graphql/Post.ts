import { objectType, extendType, stringArg, nonNull, intArg } from "nexus";

export const Post = objectType({
	name: "Post",
	definition(t) {
		t.int("id", { description: 'Unique identifier for the resource' });
		t.string("title");
		t.string("body");
		t.boolean("published");
		t.field("createdAt", { type: "DateTime" });
		t.field("updatedAt", { type: "DateTime" });
		t.field("author", { type: "User" });
	}
});

export const PostQuery = extendType({
	type: "Query",

	definition(t) {
		t.list.field("drafts", {
			type: "Post",

			resolve(_root, _args, ctx) {
				return ctx.db.post.findMany({ where: { published: false } });
			}
		});
		t.list.field("posts", {
			type: "Post",

			resolve(_root, _args, ctx) {
				return ctx.db.post.findMany({ where: { published: true } });
			}
		});
	}
});

export const PostMutation = extendType({
	type: "Mutation",

	definition(t) {
		t.field("createDraft", {
			type: "Post",

			args: {
				title: nonNull(stringArg()),
				body: nonNull(stringArg()),
				authorEmail: nonNull(stringArg())
			},
			resolve(_root, args, ctx) {
				const draft = {
					title: args.title,
					body: args.body,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					published: false
				};
				return ctx.db.post.create({
					data: {
						...draft,
						author: {
							connect: {
								email: args.authorEmail
							}
						}
					}
				});
			}
		});

		t.field("publish", {
			type: "Post",
			args: {
				draftId: nonNull(intArg())
			},

			resolve(_root, args, ctx) {
				return ctx.db.post.update({
					where: {
						id: args.draftId
					},
					data: {
						published: true
					}
				});
			}
		});
	}
});
