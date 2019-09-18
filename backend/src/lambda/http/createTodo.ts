import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { createTodo } from '../../business/todo'

const logger = createLogger('createTodo')
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // DONE: Implement creating a new TODO item
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  logger.info('Processing event: ', event)
  const itemId = uuid.v4()
  const subject = event.requestContext.authorizer.principalId

  const newItem = {
    todoId: itemId,
    createdAt: (new Date()).toISOString(),
    jwtsub: subject,
    ...newTodo
  }

  logger.info('Processing before result: ', {newItem: newItem})
  
  await createTodo(newItem)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}