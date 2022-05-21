import { objectType } from "nexus";

export const Interaction = objectType({
    name: "Interaction",
    definition(t) {
        t.int("id");
        t.int("userId");
        t.int("activityId");
        t.int('timeouts');
        t.field("createdAt", { type: "DateTime" });
        t.field("updatedAt", { type: "DateTime" });
    }
});
