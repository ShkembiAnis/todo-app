import { connectToDatabase } from "../../lib/cloudant";

const CLOUDANT_DB_NAME = process.env.CLOUDANT_DB_NAME;


export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getTodos(req, res);
        }

        case 'POST': {
            return createTodo(req, res);
        }

        case 'PUT': {
            return updateTodo(req, res);
        }

        case 'DELETE': {
            return deleteTodo(req, res);
        }
    }
}

async function getTodos(req, res) {
    try {
        console.log("get todos");
        console.log(CLOUDANT_DB_NAME);
        let { client } = await connectToDatabase();
        let result = {
            message: {
                list: []
            },
            success: false,
        }
        await client.postAllDocs({
            db: CLOUDANT_DB_NAME,
            includeDocs: true,
          }).then(response => {
            //console.log(response);
            response.result.rows.forEach( row => {
                console.log(row);
                result.message.list.push(row.doc)
            });
            result.success = true;
        });
        console.log("Result:");
        console.log(result);

        return res.json(result);
    } catch (error) {
        console.log("getTodos error: " + error);
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function createTodo(req, res) {
    console.log("create todo " + req.body)
    let todoDoc = JSON.parse(req.body);
    let { client } = await connectToDatabase();
    console.log(todoDoc);

    let result = {
        message: "",
        success: false
    }
    await client.postDocument({
        db: CLOUDANT_DB_NAME,
        document: todoDoc
      }).then(response => {
        console.log(response.result);
        result.message = response.result.error;
        result.success = response.result.ok;
      });


//    let newTodo = JSON.parse(req.body);
//    todos.list.push(newTodo);
    return res.json(result);
}

async function updateTodo(req, res) {
    console.log("update todo");
    console.log(req.body);

    let todoDoc = JSON.parse(req.body);
    let { client } = await connectToDatabase();
    console.log(todoDoc);

    let result = {
        message: "",
        success: false
    }
    await client.putDocument({
        db: CLOUDANT_DB_NAME,
        docId: todoDoc._id,
        document: todoDoc
      }).then(response => {
        console.log(response.result);
        result.message = response.result.error;
        result.success = response.result.ok;
    });

    return res.json(result);
}

async function deleteTodo(req, res) {
    console.log("delete todo");
    let deleteTodo = JSON.parse(req.body);

    let { client } = await connectToDatabase();
    console.log(deleteTodo._id);

    let result = {
        message: "",
        success: false
    }
    await client.deleteDocument({
        db: CLOUDANT_DB_NAME,
        docId: deleteTodo._id,
        rev: deleteTodo._rev,
      }).then(response => {
        console.log(response.result);
        result.message = response.result.error;
        result.success = response.result.ok;
    });

    return res.json(result);
}