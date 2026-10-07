// Данные баннеров по умолчанию.
// Вы можете менять ссылки и ID пользователей прямо в этом объекте:
const banners = {
  // Баннер по умолчанию (если ID не найден)
  default: {
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
    color: "#5865F2",
    description: "Стандартный баннер"
  },
  // Пример привязки к конкретному пользователю плагина (по ID/нику)
  "user_1": {
    bannerUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200",
    color: "#ff0055"
  }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Заголовки CORS — разрешают плагину делать запросы с любых сайтов и клиентов
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Ответ на предварительные CORS-запросы браузера/плагина
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Получение конкретного баннера по ID: GET /banner/{id}
    if (url.pathname.startsWith("/banner/")) {
      const id = decodeURIComponent(url.pathname.replace("/banner/", "").trim());
      const data = banners[id] || banners["default"];
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // 2. Получение всех баннеров разом: GET /banners или GET /api
    if (url.pathname === "/banners" || url.pathname === "/api") {
      return new Response(JSON.stringify(banners), {
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // 3. Главная страница (просмотр в браузере для быстрой проверки)
    if (url.pathname === "/") {
      const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сервер баннеров</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.5; }
    h1 { color: #38bdf8; }
    .card { background: #1e293b; padding: 1.25rem; border-radius: 10px; margin-top: 1rem; border: 1px solid #334155; }
    pre { background: #090d16; padding: 1rem; border-radius: 8px; overflow-x: auto; color: #4ade80; font-size: 0.9rem; }
    code { background: #334155; padding: 0.2rem 0.4rem; border-radius: 4px; color: #38bdf8; }
  </style>
</head>
<body>
  <h1>🚀 Сервер баннеров работает</h1>
  <p>Все запросы из вашего плагина будут успешно проходить без ошибок CORS.</p>
  
  <div class="card">
    <h3>Адреса для вашего плагина:</h3>
    <p>• Все баннеры: <code>/banners</code></p>
    <p>• Баннер конкретного пользователя: <code>/banner/user_1</code></p>
  </div>

  <div class="card">
    <h3>Текущие активные данные:</h3>
    <pre>${JSON.stringify(banners, null, 2)}</pre>
  </div>
</body>
</html>`;
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};