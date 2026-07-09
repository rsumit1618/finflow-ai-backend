import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected (local)');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redisClient;
