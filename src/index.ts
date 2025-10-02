import { serve } from "bun";
import * as cache from "./cache";

serve({
  routes: {
    "/random-draw": {
      GET: async (req) => {
        try {
          const url = new URL(req.url);
          const v = url.searchParams.get("v");
          if (v == null) return error(usage(), 400);

          const items = v.split(",").map((x) => x.trim());
          const key = items.join(",");
          const result = cache.get(key, () => randomDraw(items));

          console.info(new Date().toISOString(), items, result);
          return json({
            result,
            items,
          });
        } catch (error) {
          if (error instanceof Response) {
            return error;
          }
          throw error;
        }
      },
    },
    "/cache": {
      DELETE: async () => {
        cache.prune();
        return json({}, 204);
      },
    },
  },
});

function randomDraw(items: string[]) {
  if (items.length <= 1) throw error(usage(), 400);
  const index = Math.floor(Math.random() * items.length);
  const item = items[index];
  if (item == null) throw error(usage(), 400);

  return item;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function error(message: string, status: number) {
  return json({ error: message }, status);
}

function usage() {
  return `usage: /random-draw?v=1,2,3`;
}
