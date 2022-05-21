import { objectType, enumType } from "nexus";
import { ActivityType, ActivityStatus } from "nexus-prisma";

export const activityType = enumType(ActivityType);
export const activityStatus = enumType(ActivityStatus);

export const Activity = objectType({
    name: "Activity",
    definition(t) {
        t.int("id");
        t.string("title");
        t.field("type", { type: activityType });
        t.field("status", { type: activityStatus });
        t.field("createdAt", { type: "DateTime" });
        t.field("updatedAt", { type: "DateTime" });
        t.int('timeouts');
        t.field("challenge", { type: "Challenge" });
        t.list.field("interactions", {
            type: "Interaction",
            resolve(root, args, ctx) {
                return ctx.db.interaction.findMany({ where: { activityId: root.id } });
            }
        });
    }
});
