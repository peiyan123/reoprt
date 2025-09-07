const http = require('http');
const fs = require('fs');
const path = require('path');

// 端口号，你可以修改为任何未使用的端口
const PORT = 8080;

// 支持的MIME类型
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 获取请求的URL路径
  let url = req.url;
  
  // 默认访问index.html
  if (url === '/') {
    url = '/index.html';
  }
  
  // 构建文件路径
  const filePath = path.join(__dirname, url);
  
  // 获取文件扩展名
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // 尝试读取文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // 文件不存在或其他错误
      if (err.code === 'ENOENT') {
        // 404 文件未找到
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 Not Found</h1><p>The requested file ${url} was not found on this server.</p>`);
      } else {
        // 其他服务器错误
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>500 Internal Server Error</h1><p>Error: ${err.code}</p>`);
      }
    } else {
      // 成功读取文件，设置正确的内容类型并发送
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`请在浏览器中访问：http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止服务器');
});
