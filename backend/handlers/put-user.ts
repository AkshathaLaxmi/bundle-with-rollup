import { randomUUID } from "crypto";
import { AnyObject } from "yup/lib/types";
import { putItem } from "../utils/db";
import { pick } from "lodash";

exports.handler = async (event: AnyObject) => {
    try {
        console.log(`EVENT: ${JSON.stringify(event)}`);
        const user = event?.arguments?.input;
        user.id = randomUUID();

        const userInfo = pick(user, ["id", "email"])
        const tableName = process.env.USER_TABLE || ""
        const result = await putItem(tableName, userInfo);

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        }
    }
}