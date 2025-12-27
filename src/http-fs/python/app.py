import asyncio
import json
from typing import Optional, TypedDict

import httpx


class Todo(TypedDict, total=False):
    id: int
    userId: int
    title: str
    completed: bool


API_BASE_URL = "https://jsonplaceholder.typicode.com/todos"


async def http_request(url: str, method: str = "GET", data: Optional[dict] = None) -> Todo:
    async with httpx.AsyncClient() as client:
        response = await client.request(method, url, json=data)
        response.raise_for_status()
        return response.json()


async def get_todo() -> None:
    todo: Todo = await http_request(f"{API_BASE_URL}/201")
    with open("result.json", "w", encoding="utf-8") as file:
        json.dump(todo, file, ensure_ascii=False, indent=2)


async def create_post() -> None:
    payload: Todo = {
        "userId": 1,
        "title": "This is my 1st TODO",
        "completed": False,
    }
    created: Todo = await http_request(API_BASE_URL, "POST", payload)
    payload["id"] = created.get("id")

    with open("result-create.json", "w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)


async def main() -> None:
    await get_todo()
    await create_post()


if __name__ == "__main__":
    asyncio.run(main())
