import { objectType, enumType } from "nexus";
import { Role } from "nexus-prisma";

export const roles = enumType(Role);

export const User = objectType({
	name: "User",
	definition(t) {
		t.nonNull.int("id", { description: "Unique identifier for the resource" });
		t.nonNull.string("email");
		t.nonNull.string("name");
		t.string("token");
		t.nonNull.field("role", { type: roles });
		t.list.field("posts", {
			type: "Post",
			resolve(root, _args, ctx) {
				return ctx.db.post.findMany({ where: { authorId: root.id } });
			}
		});
		t.list.field("interactions", {
			type: "Interaction",
			resolve(root, _args, ctx) {
				return ctx.db.interaction.findMany({ where: { userId: root.id } });
			}
		});
		t.field("profile", {
			type: "Profile",
			resolve(root, _args, ctx) {
				return ctx.db.profile.findUnique({ where: { userId: root.id } });
			}
		});
		t.field("createdAt", { type: "DateTime" });
		t.field("updatedAt", { type: "DateTime" });
	}
});
