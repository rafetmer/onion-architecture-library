# 1. Adım: Temel imajı belirle (Multi-stage build için ilk aşama)
FROM node:18-alpine AS base

# 2. Adım: Uygulama için çalışma dizinini ayarla
WORKDIR /app

# 3. Adım: Bağımlılıkları yükle (sadece paket dosyaları değiştiğinde bu katman yeniden çalışır)
# Bu, Docker katman önbelleklemesini (layer caching) optimize eder.
COPY package*.json ./
RUN npm install

# 4. Adım: Prisma şemasını kopyala
COPY prisma ./prisma/

# 5. Adım: Prisma Client'ı oluştur (veritabanı bağlantısı olmadan)
# Bu adım, veritabanı çalışmıyorken bile imajın başarılı bir şekilde build edilmesini sağlar.
RUN npx prisma generate

# 6. Adım: Uygulama kodunun tamamını kopyala
COPY . .

# 7. Adım: TypeScript kodunu JavaScript'e derle
RUN npm run build

# 8. Adım: Production imajını oluştur (daha küçük ve güvenli)
FROM node:18-alpine AS production
WORKDIR /app

# Sadece production bağımlılıklarını yükle
COPY --from=base /app/package*.json ./
RUN npm install --omit=dev

# Derlenmiş kodu ve Prisma client'ı kopyala
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma

# 9. Adım: Uygulamanın çalışacağı portu dışarıya aç
EXPOSE 3001

# 10. Adım: Uygulamayı başlat
CMD ["npm", "run", "start"]