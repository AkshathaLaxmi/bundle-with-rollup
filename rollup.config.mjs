import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "@rollup/plugin-typescript";

const plugins = [
  nodeResolve({
    resolveOnly: (module) => !module.includes("aws-sdk")
  }),
  commonjs(),
  json(),
  ts({ compilerOptions: { lib: ["es5", "es6", "dom"], target: "es5" } })
];

const handlersPath = `backend/handlers`;
const lambdaPath = `src/handlers`;

const format = "cjs";

const config = [
    {
        input: `${handlersPath}/get-all-organizations.ts`,
        output: {
            file: `${lambdaPath}/get-all-organizations.js`,
            format
        },
        plugins
    },
    {
        input: `${handlersPath}/get-all-users.ts`,
        output: {
            file: `${lambdaPath}/get-all-users.js`,
            format
        },
        plugins
    },
    {
        input: `${handlersPath}/get-organization-by-id.ts`,
        output: {
            file: `${lambdaPath}/get-organization-by-id.js`,
            format
        },
        plugins
    },
    {
        input: `${handlersPath}/get-user-by-id.ts`,
        output: {
            file: `${lambdaPath}/get-user-by-id.js`,
            format
        },
        plugins
    },
    {
        input: `${handlersPath}/put-organization.ts`,
        output: {
            file: `${lambdaPath}/put-organization.js`,
            format
        },
        plugins
    },
    {
        input: `${handlersPath}/put-user.ts`,
        output: {
            file: `${lambdaPath}/put-user.js`,
            format
        },
        plugins
    }
]

export default config;
