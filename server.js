// 依存パッケージなしの簡易静的ファイルサーバー（ES Modules は file:// では読み込めないため）
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 8080;
// WSL2 では IPv6 で待ち受けると Windows 側の 127.0.0.1 から届かないため IPv4 を明示する
const host = process.env.HOST || '0.0.0.0';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  let file;
  try {
    file = normalize(join(root, decodeURIComponent(pathname === '/' ? '/index.html' : pathname)));
  } catch {
    res.writeHead(400).end('Bad Request');
    return;
  }

  // ルート外へのパストラバーサルを拒否
  if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not Found');
  }
}).listen(port, host, () => {
  console.log(`TODO アプリ: http://localhost:${port}`);
});
