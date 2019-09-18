import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { DeleteItemInput } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../../utils/logger'
import * as AWS  from 'aws-sdk'
import { deleteTodo } from '../../business/todo';

const logger = createLogger('auth')
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Processing event: ', event)
  // DONE: Remove a TODO item by id
  const result = await deleteTodo(todoId)
  logger.info('Processing result: ', {result: result})

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      result
    })
  }
}
