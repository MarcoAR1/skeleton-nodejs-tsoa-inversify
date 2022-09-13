import 'reflect-metadata'
import { env } from './env/enviroment'
import { InversifySocketServer } from 'inversify-socket-utils'
import { iocContainer } from './ioc/container'
import { json, urlencoded } from 'body-parser'
import { middleware } from 'express-http-context'
import { RegisterRoutes } from './routes/routes'
import { Server as ServerSocket } from 'socket.io'
import { writeFileSync } from 'node:fs'
import * as http from 'http'
import compress from 'compression'
import correlationId from './middlewares/correlationId'
import cors from 'cors'
import Express, { Application, Request, Response } from 'express'
import handleError from './middlewares/handleError'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import swaggerUi from 'swagger-ui-express'

export class Server {
  private port: string

  private httpServer: http.Server

  constructor(port: string) {
    this.port = port
    const app = Express()

    const corsConfiguration: cors.CorsOptions = {
      origin: '*',
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE'
    }
    app.use(cors(corsConfiguration))
    morgan.token('json', function (req) {
      return JSON.stringify({
        url: req.url,
        method: req.method,
        httpVersion: req.httpVersion
      })
    })
    app.use(middleware)
    app.use(correlationId)
    app.disable('x-powered-by')
    app.use(morgan(':method :status :url :response-time :json'))
    app.use(urlencoded({ extended: true }))
    app.use(json())
    app.use(helmet.xssFilter())
    app.use(helmet.noSniff())
    app.use(helmet.hidePoweredBy())
    app.use(helmet.frameguard({ action: 'deny' }))
    app.use(compress())
    this.configIocContainer()
    RegisterRoutes(app)
    this.configSwagger(app)
    app.use(handleError)

    this.httpServer = http.createServer(app)
    const io = new ServerSocket(this.httpServer, {
      cors: {
        origin: '*'
      }
    })
    new InversifySocketServer(iocContainer, io).build()
  }

  async listen(): Promise<void> {
    new Promise(resolve => {
      this.httpServer.listen(this.port)
      resolve(null)
    })
    console.log(`  Skeleton is running at port ${this.port} in ${env} mode`)
    console.log('  Press CTRL-C to stop\n')
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close(error => {
          if (error) {
            return reject(error)
          }
          return resolve()
        })
      }

      return resolve()
    })
  }

  async configIocContainer() {
    if (!iocContainer) throw new Error('container is not initialized')
  }

  getServer(): http.Server {
    return this.httpServer
  }

  private configSwagger(app: Application) {
    app.use('/api-docs', swaggerUi.serve, async (_: Request, res: Response) => {
      const swagger = await import('./routes/swagger.json')
      const securitySchemes = {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          description:
            "JWT Authorization header using the Bearer scheme. \n                      Enter your JWT token in the text input below. You can omit the 'Bearer ' prefix ;)"
        }
      }
      const swaggerSecuritySchemes: Record<string, object> = swagger.components.securitySchemes
      if (!swaggerSecuritySchemes.jwt) {
        Object.assign(swagger.components.securitySchemes, securitySchemes)
        writeFileSync(path.resolve(__dirname, './routes/swagger.json'), JSON.stringify(swagger, null, 2))
      }
      return res.send(swaggerUi.generateHTML(swagger))
    })
  }
}
