import express, { response } from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const MockData = [
  { id: 1, username: "anson", displayName: "Anson" },
  { id: 2, username: "sam", displayName: "Samone" },
  { id: 3, username: "kem", displayName: "Kemone" },
];
app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello" });
});

app.get("/api/users", (request, response) => {
  console.log(request.query);
  const {
    query: { filter, value },
  } = request;

  if (!filter && !value) return response.send(MockData);
  if (filter && value)
    return response.send(
      MockData.filter((user) => user[filter].includes(value))
    );
  return response.send(MockData);
});

app.post("/api/users", (request, response) => {
  console.log(request.body);
  return response.send(200);
});

app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parseId = parseInt(id);
  if(isNaN(parseId)) return response.sendStatus(400);
  const findUserIndex = MockData.findIndex((user) => user.id === parseId);
  if (!findUserIndex) return response.sendStatus(404);
  MockData[findUserIndex] = { id: parseId, ...body };
  return response.sendStatus(200);
});

app.patch("/api/users/:id", (request, response) => {
    const {
      body,
      params: { id },
    } = request;
    const parseId = parseInt(id);
    const username = body.username || "Unknown Username";
    const displayName = body.displayName
    if(isNaN(parseId)) return response.sendStatus(400);
    const findUserIndex = MockData.findIndex((user) => user.id === parseId);
    if (!findUserIndex) return response.sendStatus(404);
    MockData[findUserIndex] = { id: parseId, ...{username,displayName}  };
    return response.sendStatus(200);
});

app.delete("/api/users/:id", (request, response) => {
  const { params: { id } } = request;
  const index = MockData.findIndex((user) => user.id == id);
  if (index !== -1) {
    MockData.splice(index, 1);
  }
  return response.status(200).json({ message: `Deleted user with ${id}`})
});

app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parseId = parseInt(request.params.id);
  if (isNaN(parseId))
    return response.status(400).send({ msg: "Bad Request. Invalid Id" });
  const findUser = MockData.find((users) => users.id === parseId);
  if (!findUser) {
    return response.sendStatus(404);
  }
  return response.send(findUser);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
