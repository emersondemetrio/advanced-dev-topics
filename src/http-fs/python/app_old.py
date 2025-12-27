import json
import urllib.request
from typing import Optional, TypedDict


class Todo(TypedDict, total=False):
    id: int
    userId: int
    title: str
    completed: bool


API_BASE_URL = "https://jsonplaceholder.typicode.com/todos"


def http_request(url: str, method: str = "GET", data: Optional[dict] = None) -> Todo:
    payload_bytes: Optional[bytes] = None
    headers = {}

    if data is not None:
        payload_bytes = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = urllib.request.Request(url, data=payload_bytes, method=method, headers=headers)
    with urllib.request.urlopen(request) as response:  # nosec: B310 - public demo endpoint
        if response.status >= 400:
            raise urllib.error.HTTPError(url, response.status, response.reason, response.headers, None)
        return json.loads(response.read().decode("utf-8"))


def get_todo() -> None:
    todo: Todo = http_request(f"{API_BASE_URL}/1")
    print("TODO", todo)
    with open("result.json", "w", encoding="utf-8") as file:
        json.dump(todo, file, ensure_ascii=False, indent=2)


def create_post() -> None:
    payload: Todo = {
        "userId": 1,
        "title": "This is my 1st TODO",
        "completed": False,
    }
    created: Todo = http_request(API_BASE_URL, "POST", payload)
    payload["id"] = created.get("id")

    print("RESULT", payload)

    with open("result-create.json", "w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)


def main() -> None:
    get_todo()
    create_post()


if __name__ == "__main__":
    main()
