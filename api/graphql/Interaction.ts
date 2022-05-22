import { objectType } from "nexus";

export const Interaction = objectType({
	name: "Interaction",
	definition(t) {
		t.nonNull.int("id");
		t.nonNull.int("userId");
		t.nonNull.int("activityId");
		t.int("timeouts");
		t.field("user", {
			type: "User",
			resolve: async (parent, args, ctx) => {
				return ctx.db.user.findUnique({ where: { id: parent.userId } });
			}
		});
		t.field("activity", {
			type: "Activity",
			resolve: async (parent, args, ctx) => {
				return ctx.db.activity.findUnique({ where: { id: parent.activityId } });
			}
		});
		t.field("createdAt", { type: "DateTime" });
		t.field("updatedAt", { type: "DateTime" });
	}
});
