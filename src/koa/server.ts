import getTracer from "./tracer";

const tracer = getTracer("koa-example-server");

import Router from "@koa/router";
import Koa, { Context, Next } from "koa";

const app = new Koa();
const router = new Router();
const PORT = 8080;

router
  .get("/run_test", runTest)
  .get("/post/new", addPost)
  .get("/post/:id", showNewPost);

async function setUp() {
  app.use(noOp);
  app.use(router.routes());
}

const posts = ["post 0", "post 1", "post 2"];

function addPost(ctx: Context) {
  posts.push(`post ${posts.length}`);

  const currentSpan = tracer.getCurrentSpan() || tracer.startSpan("addPost");
  currentSpan.addEvent("Added post");
  currentSpan.setAttribute("Date", new Date());

  ctx.body = `Added post: ${posts[posts.length - 1]}`;
  ctx.redirect("/post/3");
}

async function showNewPost(ctx: Context) {
  const { id } = ctx.params;
  console.log(`showNewPost with id: ${id}`);

  const post = posts[id];
  tracer.getCurrentSpan()?.setAttribute("post", post);
  if (!post) {
    return ctx.throw(404, "Invalid post id");
  }

  const syntheticDelay = 500;
  await new Promise((r) => setTimeout(r, syntheticDelay));

  ctx.status = 200;
  return (ctx.body = post);
}

function runTest(ctx: Context) {
  console.log("runTest");
  const currentSpan = tracer.getCurrentSpan() || tracer.startSpan("runTest");
  const { traceId } = currentSpan.context();
  console.log(`traceid: ${traceId}`);
  ctx.body = `All posts: ${posts}`;
  ctx.redirect("/post/new");
}

async function noOp(ctx: Context, next: Next) {
  console.log("Sample basic koa middleware");
  const syntheticDelay = 100;
  await new Promise((r) => setTimeout(r, syntheticDelay));
  await next();
}

setUp().then(() => {
  app.listen(PORT);
  console.log(`Listening on http://localhost:${PORT}`);
});
