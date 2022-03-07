const request = require("supertest");
const app = require("../src/app.js");
var fs = require("fs");

const db = require("../src/db/db.js");
const TodoItem = require("../src/models/todo.js");
const dbPath = "data/test.db";

const testTodos = [
  "Finish designing the API",
  "Paginate API",
  "Commit and push code",
  "Share repo",
  "Write tests",
  "Add documentation",
];

beforeAll(async () => {
  await db.setUp();

  for (const todo of testTodos) {
    await db.saveTodo(new TodoItem(null, todo, false));
  }
});

afterAll(async () => {
  fs.unlinkSync(dbPath);
  app.close();
});

describe("TODO Endpoints", () => {
  it("GET /todos should have full list of all todos", async () => {
    const res = await request(app)
      .get("/api/todos")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(200);
    expect(res.body.results).toBeDefined();
    expect(res.body.results.length).toEqual(testTodos.length);
    expect(res.body.results[0].title).toEqual(testTodos[0]);
    expect(res.body.next).toBeUndefined();
  });

  it("GET /todos?page=1 should have full list of first 5 todos and next pagination", async () => {
    const res = await request(app)
      .get("/api/todos?page=1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(200);
    expect(res.body.results).toBeDefined();
    expect(res.body.results.length).toEqual(5);
    expect(res.body.results[0].title).toEqual(testTodos[0]);
    expect(res.body.next).toBeDefined();
    expect(res.body.next.page).toEqual(2);
    expect(res.body.next.limit).toEqual(5);
  });

  it("GET /todos?page=2 should have list of next todos and previous pagination", async () => {
    const res = await request(app)
      .get("/api/todos?page=2")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(200);
    expect(res.body.results).toBeDefined();
    expect(res.body.results.length).toEqual(1);
    expect(res.body.results[0].title).toEqual(testTodos[5]);
    expect(res.body.previous).toBeDefined();
    expect(res.body.previous.page).toEqual(1);
    expect(res.body.previous.limit).toEqual(5);
  });

  it("POST /todos should add a new todo item to the database", async () => {
    const title = "Cool new TODO";

    const res = await request(app)
      .post("/api/todos")
      .set("Accept", "application/json")
      .send({ title })
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual(title);
    expect(res.body.id).toEqual(testTodos.length + 1);
  });

  it("PUT /todo should update todo item [MARK AS COMPLETE]", async () => {
    const id = 1;

    let item = await db.getTodo(id);
    expect(item.id).toEqual(1);
    expect(item.title).toEqual(testTodos[0]);
    expect(item.completed).toEqual(false);

    const res = await request(app)
      .put(`/api/todos/${id}`)
      .set("Accept", "application/json")
      .send({ completed: true })
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(200);

    item = await db.getTodo(id);
    expect(item.completed).toEqual(true);
  });

  it("DELETE /todo should remove todo item from database", async () => {
    const totalSize = testTodos.length + 1;

    let dbSize = await db.getSize();
    expect(dbSize).toEqual(totalSize);

    const res = await request(app)
      .delete(`/api/todos/${totalSize}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(res.statusCode).toEqual(200);

    dbSize = await db.getSize();
    expect(dbSize).toEqual(totalSize - 1);
  });
});
