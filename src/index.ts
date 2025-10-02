import { escapeHTML, serve } from "bun";

serve({
  routes: {
    "/random-draw": {
      GET: async (req) => {
        try {
          const url = new URL(req.url);
          const v = url.searchParams.get("v");
          if (v == null) return new Response(usage(), { status: 400 });

          const items = v.split(",").map((x) => x.trim());
          const item = randomDraw(items);

          console.info(new Date().toISOString(), items, item);
          return new Response(html(items, item), {
            headers: {
              "Content-Type": "text/html;charset=utf-8",
              "Cache-Control": "no-store",
            },
          });
        } catch (error) {
          if (error instanceof Response) {
            return error;
          }
          throw error;
        }
      },
    },
  },
});

function randomDraw(items: string[]) {
  if (items.length <= 1) throw new Response(usage(), { status: 400 });
  const index = Math.floor(Math.random() * items.length);
  const item = items[index];
  if (item == null) throw new Response(usage(), { status: 400 });

  return item;
}

function html(items: string[], item: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:title" content="Random draw" />
    <meta property="og:description" content="result: ||??||" />
    <title>Random draw</title>
  </head>
  <body>
    <h1>Random draw</h1>
    <section>
      <h2>result</h2>
      ${escapeHTML(item)}
    </section>
    <section>
      <h2>list</h2>
      ${escapeHTML(items.join(", "))}
    </section>
    <section>
      <h2>usage</h2>
      <code>${escapeHTML(usage())}</code>
    </section>
  </body>
</html>
`;
}

function usage() {
  return `usage: /random-draw?v=1,2,3`;
}
