import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)

	app.setGlobalPrefix('api')

	const nodeEnv = configService.get('NODE_ENV') || 'development'
	const clientUrl = configService.get('CLIENT_URL')
	const port = configService.get('PORT') || 4200

	const allowedOrigins =
		nodeEnv === 'production'
			? [
					clientUrl,
					'https://frontend-5s9m.vercel.app',
					'https://frontend-5s9m.vercel.app/',
					'https://www.frontend-5s9m.vercel.app',
			  ]
			: [
					'http://localhost:3000',
					'http://192.168.8.83:3000',
					'http://127.0.0.1:3000',
					'http://localhost:3001',
					'http://localhost:4200',
			  ]

	app.enableCors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true)

			const isAllowed = allowedOrigins.some(
				(allowedOrigin) =>
					origin === allowedOrigin ||
					origin.startsWith(allowedOrigin.replace(/\/$/, ''))
			)

			if (isAllowed) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'X-Requested-With',
			'Access-Control-Allow-Origin',
			'Access-Control-Allow-Headers',
			'Access-Control-Allow-Methods',
		],
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})

	await app.listen(port)
}

bootstrap()
