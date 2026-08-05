import { Client } from 'pg';

/**
 * isActive는 CreateProductDto에 없고 Product.create()가 항상 true로 고정하므로,
 * 필터 테스트용 비활성 상품은 DB에서 직접 만든다.
 * 상품 비활성화 유스케이스가 생기면 이 스크립트는 그쪽으로 대체된다.
 */
const INACTIVE_SKUS = [
  'ACC-CLN-KIT', // 9.99
  'ACC-CBL-HDMI', // 24.99
  'MS-LITE-02', // 39.99
  'DSK-LAMP-01', // 69.99
  'STO-HDD-8TB', // 179.00
  'MON-32-QHD', // 329.99
  'MON-49-UW', // 999.99
  'LAP-16-MAX', // 2499.00
];

const client = new Client({
  connectionString: process.env.POSTGRES_DATABASE_URL,
});

await client.connect();

const result = await client.query(
  'UPDATE products SET is_active = false, updated_at = now() WHERE sku = ANY($1)',
  [INACTIVE_SKUS],
);

console.log(`deactivated ${result.rowCount} products`);

await client.end();
