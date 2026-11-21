# How to put the site online

The folder **`publish/`** contains exactly the files that must go on the server:

```
publish/
├── index.html          ← page d'accueil / форма ввода номера
├── verify.html         ← страница проверки
├── app.js  qrcode.js
├── assets/style.css
├── data/vouchers.js    ← ваши записи
├── robots.txt
├── _headers            ← кэш для Netlify / Cloudflare
└── .htaccess           ← кэш для Apache
```

`admin.html` **намеренно не входит** — это ваш внутренний конструктор ваучеров,
его нельзя выкладывать в интернет. Открывайте его из папки `Nouveau dossier`
на своём компьютере.

---

## 1. Домен

Купить домен может только вы (нужна ваша карта и аккаунт). Регистраторы:

| Регистратор | Цена примерно | Примечание |
| --- | --- | --- |
| **Cloudflare Registrar** | ~10 €/год | самый дешёвый, DNS уже включён |
| **Porkbun** | ~10 €/год | простой интерфейс |
| **Namecheap** | ~10–13 €/год | популярный |
| **OVH / Gandi / Ionos** | ~12–18 €/год | если вы во Франции |

Примеры имён (замените на своё):

- `check.votre-company.com`
- `verify.votre-company.com`
- `votre-company-check.com`
- `votre-company-viza.ru`

Поддомен (`check.…`) бесплатен, если основной домен уже ваш.

> Не покупайте домен, похожий на чужой (`globaelvoyazh…` и т.п.) — это
> закончится блокировкой у хостинга и претензиями от владельца бренда.

---

## 2. Загрузка — вариант A: Netlify Drop (самый быстрый)

1. Откройте <https://app.netlify.com/drop>.
2. Перетащите **папку `publish`** целиком в окно браузера.
3. Через ~20 секунд получите адрес вида `random-name-123.netlify.app`.
   Проверьте: `https://random-name-123.netlify.app/verify.html?code=DEMO-4X7K-92MQ`.
4. Зарегистрируйтесь (бесплатно), чтобы сайт не удалился.
5. Свой домен: **Domain settings → Add a domain** → введите домен →
   Netlify покажет DNS-записи.

## 3. Загрузка — вариант B: обычный хостинг с cPanel

1. Купите хостинг (Hostinger, OVH, Ionos…).
2. Панель → **File Manager** → папка `public_html`.
3. Загрузите **содержимое** папки `publish` (не саму папку), архивом или по файлам.
4. Сайт откроется по вашему домену сразу после привязки.

## 4. Загрузка — вариант C: Cloudflare Pages

1. <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages → Upload assets**.
2. Перетащите папку `publish`, нажмите **Deploy**.
3. Адрес `project.pages.dev`, потом **Custom domains → Set up a domain**.

---

## 5. Привязать домен (DNS)

У регистратора домена создайте записи, которые показывает хостинг:

| Тип | Имя | Значение |
| --- | --- | --- |
| `CNAME` | `check` (или `@` для основного) | адрес, который дал хостинг, например `random-name-123.netlify.app` |
| `A` | `@` | IP хостинга (только если хостинг дал IP) |

DNS обновляется от 5 минут до 24 часов. HTTPS-сертификат Netlify/Cloudflare
выпускает сам, бесплатно — ничего делать не нужно.

---

## 6. После публикации (обязательно)

1. В `data/vouchers.js`, строка 27, поставьте реальный адрес:
   ```js
   siteUrl: "https://check.votre-company.com",
   ```
   Без `/` в конце. Если сайт лежит в подпапке — включите её:
   `https://votre-company.com/check`.
2. Замените демо-записи на свои (или попросите меня).
3. Поднимите версию скриптов в `index.html` и `verify.html`:
   `app.js?v=5`, `data/vouchers.js?v=5` — иначе посетители увидят старую версию.
4. Проверьте на телефоне: `https://ваш-домен/verify.html?code=ВАШ-НОМЕР`.

## 7. Что я не могу сделать за вас

- купить домен и оплатить хостинг;
- войти в ваш аккаунт Netlify/Cloudflare/OVH;
- подтвердить, что вы имеете право публиковать документы от имени компании.

Всё остальное — файлы, конфигурация, проверка — готово.
