import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)

	app.setGlobalPrefix('api')
	const allowedOrigins =
		configService.get('NODE_ENV') === 'production'
			? [
					configService.get('CLIENT_URL'), // ваш продакшен фронтенд
					'https://frontend-5s9m.vercel.app/', // замените на реальный домен
			  ]
			: [
					'http://localhost:3000',
					'http://192.168.8.83:3000',
					'http://127.0.0.1:3000',
					'http://localhost:3001',
			  ]

	app.enableCors({
		origin: allowedOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	})

	const port = configService.get('PORT') || 4200

	await app.listen(port)
	console.log(`Application is running on: http://localhost:${port}`)
	console.log(`Environment: ${configService.get('NODE_ENV') || 'development'}`)
	console.log(`Allowed origins: ${allowedOrigins.join(', ')}`)
}

bootstrap()
