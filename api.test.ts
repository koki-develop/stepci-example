import { run, runFromFile, Workflow } from "@stepci/runner";
import { expect, it } from "vitest";

it("from file", async () => {
  const { result } = await runFromFile("./workflow.yml");
  expect(result.passed).toBe(true);
});

it("from config", async () => {
  const workflow: Workflow = {
    version: "1.1",
    name: "Validating JSON",
    config: {
      http: { baseURL: "https://jsonplaceholder.typicode.com" },
    },
    env: { postId: "2" },
    tests: {
      example: {
        steps: [
          {
            name: "GET request",
            http: {
              url: "/posts/${{env.postId}}",
              method: "GET",
              check: {
                status: 200,
                jsonpath: { "$.id": "${{env.postId}}", "$.userId": 1 },
              },
            },
          },
        ],
      },
    },
  };

  const { result } = await run(workflow);
  expect(result.passed).toBe(true);
});
