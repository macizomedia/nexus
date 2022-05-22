import { objectType, enumType } from "nexus";
import { ActivityType, ActivityStatus } from "nexus-prisma";

export const activityType = enumType(ActivityType);
export const activityStatus = enumType(ActivityStatus);

export const Activity = objectType({
	name: "Activity",
	definition(t) {
		t.nonNull.int("id");
		t.string("title");
		t.field("type", { type: activityType });
		t.field("status", { type: activityStatus });
		t.field("createdAt", { type: "DateTime" });
		t.field("updatedAt", { type: "DateTime" });
		t.int("timeouts");
		t.nonNull.int("challengeId");
		t.field("challenge", {
			type: "Challenge",
			resolve(root, args, ctx) {
				return ctx.db.challenge.findUnique({ where: { id: root.challengeId } });
			}
		});
		t.list.field("interactions", {
			type: "Interaction",
			resolve(root, args, ctx) {
				return ctx.db.interaction.findMany({ where: { activityId: root.id } });
			}
		});
	}
});
