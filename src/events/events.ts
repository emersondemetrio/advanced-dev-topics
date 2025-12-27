import { EventEmitter } from "events";
import { writeFile } from "fs/promises";

import { httpPromise } from "../common/api";
import { API_BASE_URL } from "../constants";

export type ToDo = {
  id?: number;
  userId: number;
  title: string;
  completed: boolean;
};

export class TodoEmitter extends EventEmitter {
  async fetchTodo(id = 1): Promise<void> {
    try {
      this.emit('fetch_started', id)
      const todo: ToDo = await httpPromise(`${API_BASE_URL}/${id}`);
      this.emit("fetched", todo);

      const fileName = "./result.json"
      this.emit('store_started', fileName)
      await writeFile(fileName, JSON.stringify(todo, null, 2), "utf-8");
      this.emit("stored", fileName);
    } catch (error) {
      this.emit("error", error instanceof Error ? error : new Error(String(error)));
    }
  }

  async createTodo(): Promise<void> {
    try {
      const payload: ToDo = {
        userId: 1,
        title: "This is my 1st TODO",
        completed: false,
      };

      const created: ToDo = await httpPromise(API_BASE_URL, "POST", payload as any);
      payload.id = created.id;

      this.emit("created", payload);

      await writeFile("./result-create.json", JSON.stringify(payload, null, 2), "utf-8");
      this.emit("stored", "result-create.json");
    } catch (error) {
      this.emit("error", error instanceof Error ? error : new Error(String(error)));
    }
  }
}

export const todoEmitter = new TodoEmitter();
