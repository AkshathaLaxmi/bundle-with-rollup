# Achieving Superior Code Bundling for Serverless Projects with the rollupJS approach 
#### Coders can achieve superior code bundling with this approach

As a developer who writes many lambda functions for a project, I have encountered the issue of code organization in serverless projects. In larger serverless projects, this issue is
magnified, as there is a large amount of code present. Without organization, the code written is neither readable nor understandable, which can lead to issues with knowledge transfers and documentation. Developers currently manage this situation by bundling code.

Before jumping into the types of bundling currently used by developers, their pros and cons, and how to overcome them, let's get a little background on what bundling is and how it works.

## What is bundling?
Bundling is a common technique used in frontend stacks to resolve a large set of dependencies and package the required modules into optimized bundles for the browser to efficiently load the web application. Bundling serverless code offers excellent organization of code, improved navigation, improved readability, code reusability, tree shaking, and the ability to perform local unit testing.

Bundling serverless code allows developers to group certain kinds of handlers and organize code based on functionality. This makes it easier for developers to navigate through the project and also improves readability. Additionally, bundling code of similar functionality allows developers to reuse code, which reduces the amount of code that needs to be written and maintained.

### How does bundling work?
Bundling works by compiling small pieces of code into something larger and more complex, such as a library or application. The process of compiling requires the bundler to use an optimization logic to serve the web pages in the least amount of time.

### Types of bundling currently used
The most common type of bundling approaches currently used are SAM and Lambda Layers. Each has its advantages and disadvantages, and it's important to choose the approach that best fits the project's needs. 

 1. SAM:
For example, esbuild in SAM offers great organization of code, improved navigation, improved readability, code reusability, and [tree shaking](https://www.antstack.com/blog/nodejs-lambda-bundling-tree-shaking-webpack/), but it is not cloud/framework agnostic and does not offer official plugin support for the commonjs module format.

 2. Lambda Layers:
On the other hand, Lambda Layers are language agnostic, but do not offer tree shaking, are not cloud agnostic, and cannot perform local unit testing.

This has led to frustration in developers as they need to trade off certain benefits for better project organization and code reusability.

Due to the cons in the existing approach, what developers need is a universal approach that can help them receive all the benefits that current approaches provide while also providing developers with the ability to have tree shaking, remain cloud agnostic, and perform local unit testing.

### Bundling serverless code with rollupJS:
Bundling serverless code with rollupJS offers organization of code, improved navigation, improved readability, code reusability, tree shaking, cloud agnosticism, and the ability to perform local unit testing. It also supports both es modules (by default) and commonjs modules (using the official plugin). 

ES modules let you freely and seamlessly combine the most useful individual functions from your favorite libraries. This will eventually be possible natively everywhere, but Rollup lets you do it today. 

To demonstrate the effectiveness of the approach, we will provide an example with code and directory structure.

#### How bundling with rollupJS works?
In this example will use SAM for Infrastructure as Code and will have two tables (User and Organization) and six lambda functions (get all items for organization, get all items for the user, get organization by ID, get user by ID, put organization, and put user). The code snippets will include npm packages and a rollup config.

We will use the following directory structure for the example application:

```
/
    /backend
        /handlers
            get-all-organizations.ts
            get-all-users.ts
            get-organization-by-id.ts
            get-user-by-id.ts
            put-organization.ts
            put-user.ts
        /utils
            db.ts
    /src
        /handlers
            get-all-organizations.js
            get-all-users.js
            get-organization-by-id.js
            get-user-by-id.js
            put-organization.js
            put-user.js
    package.json
    rollup.config.mjs
```

We will use the bundler to transpile the utils/db.js file into the individual functions in the functions directory.

This is an example configuration that can be used with rollup:

> rollup.config.mjs
```
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "@rollup/plugin-typescript";

const plugins = [
  nodeResolve({
    resolveOnly: (module) => !module.includes("aws-sdk") // "aws-sdk" is auto installed by amplify. ignore it for now.
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
```

#### Advantages of the rollupJS approach:
 1. Better Project organization, readability, and navigation:

    It is easy to differentiate code that represents handlers from the utils  Also, Typescript code is easier to read than Javascript code. Rollup can transpile typescript to javascript.

 2. Code reusability:
 
    The util functions allow the developer to have reusable code throughout the project. This reduces the burden of copying functions and changing every single copy of it when the need for change arrives.
    
    For example, this project has the following util/db.js file:

```
import { DynamoDB } from "aws-sdk";
import { ItemList, PutItemInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { AnyObject } from "yup/lib/types";

export const dynamoDB = new DynamoDB.DocumentClient({
    region: process.env.REGION
});


export async function getItemById(tableName: string, id: string) {
    const params = {
        TableName: tableName,
        Key: {
            id: id
        }
    }
    const data = await dynamoDB.get(params).promise();
    return data?.Item;
}

export async function scanItems(tableName: string) {
    const params: ScanInput = {
        TableName: tableName
    }

    let result: ItemList = []

    do {
        const data = await dynamoDB.scan(params).promise();
        const items = data?.Items || [];
        result = [...result, ...items];
        params.ExclusiveStartKey = data?.LastEvaluatedKey;
    } while (params.ExclusiveStartKey);

    return result;
}

export async function putItem(tableName: string, item: AnyObject) {
    const params: PutItemInput = {
        TableName: tableName,
        Item: item
    }

    const result = await dynamoDB.put(params).promise();
    return result;
}
```
    
 3. Cloud agnosticism:

    Since the bundler does not affect any of the IaC (Infrastructure as Code) files, this method can be used for any cloud's serverless projects - currently not supported by SAM or Lambda Layers.
    It also gives developers the freedom of choice on the IaC framework for their project.

 4. Enables Local unit testing:

    Testing can be performed using popular tools like jest or mocha and chai since rollup does not interfere with the test configuration and files. This is not supported by Lambda Layers.

 5. Allows Tree shaking:

    Tree shaking can be observed when we use popular packages such as lodash. In many cases, only one or two functions are used from a relatively big package.
    Without tree shaking, the entire package gets imported into the generated files. This leads to unnecessary bloating. As a result, the generated code ends up having 10 times the number of lines than when generated with rollup. (I will add the necessary files for the same and add a GitHub link at the end)
    Tree shaking, however, is not supported in Lambda Layers.


For the above-said reasons, rollupJS has the potential to make knowledge transfers easier, thus empowering clients to become owners of the code base.

Please have a look at this [blog](https://www.antstack.com/blog/getting-started-with-leveraging-test-driven-development-for-aws-sam) that talks about test driven development using SAM and this [blog](https://www.antstack.com/blog/nodejs-lambda-bundling-tree-shaking-webpack) that talks about tree shaking in webpack.

The code is documented at the repository which is linked here.
