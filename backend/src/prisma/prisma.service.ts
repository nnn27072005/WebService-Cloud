import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      // Extract hostname and DB name for logging (masking credentials for security)
      const host = dbUrl.split('@')[1]?.split('/')[0] || 'Unknown Host';
      const dbName = dbUrl.split('/').pop()?.split('?')[0] || 'Unknown DB';
      this.logger.log(`🔌 Attempting to connect to database: ${host} / ${dbName}`);
    }

    try {
      await this.$connect();
      this.logger.log('✅ Database connection established successfully');
    } catch (error) {
      this.logger.error('❌ Database connection failed', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
