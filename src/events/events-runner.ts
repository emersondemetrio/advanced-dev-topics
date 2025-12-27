import { todoEmitter } from "./events";

todoEmitter
  .on("fetch_started", (id) => {
    console.log("fetch stared id:", id);
  })
  .on("fetched", (todo) => {
    console.log("Fetched TODO:", todo);
  })
  .on("created", (todo) => {
    console.log("Created TODO:", todo);
  })
  .on("store_started", (path) => {
    console.log("Storing file:", path);
  })
  .on("stored", (path) => {
    console.log("Stored file:", path);
  })
  .on("error", (err) => {
    console.error("Error:", err.message);
  });

const run = async (): Promise<void> => {
  await todoEmitter.fetchTodo();
  await todoEmitter.createTodo();
};

run().catch((error) => {
  console.error("Unhandled error:", error);
});
