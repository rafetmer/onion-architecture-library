
# Library API - Onion Architecture

Bu proje, Node.js, Express, Prisma ve TypeScript kullanılarak Soğan Mimarisi (Onion Architecture) prensiplerine göre geliştirilmiş bir kütüphane yönetim API'sidir. Bu döküman, frontend geliştiricilerinin projeyi yerel makinelerinde kurmalarına ve API'yi nasıl kullanacaklarını anlamalarına yardımcı olmak için hazırlanmıştır.

## İçindekiler

1.  [Teknolojiler](#teknolojiler)
2.  [Kurulum Adımları](#kurulum-adımları)
    - [Gereksinimler](#gereksinimler)
    - [Projeyi Klonlama](#projeyi-klonlama)
    - [Bağımlılıkları Yükleme](#bağımlılıkları-yükleme)
    - [Ortam Değişkenleri (.env)](#ortam-değişkenleri-env)
    - [Veritabanı Kurulumu](#veritabanı-kurulumu)
    - [Veritabanını Doldurma (Seed)](#veritabanını-doldurma-seed)
    - [Sunucuyu Başlatma](#sunucuyu-başlatma)
3.  [API Kullanımı](#api-kullanımı)
    - [Temel URL](#temel-url)
    - [Kimlik Doğrulama (Authentication)](#kimlik-doğrulama-authentication)
    - [API Endpoint'leri](#api-endpointleri)
        - [Auth (Kimlik Doğrulama)](#auth-kimlik-doğrulama)
        - [Users (Kullanıcılar)](#users-kullanıcılar)
        - [Books (Kitaplar)](#books-kitaplar)
        - [Loans (Ödünç Alma)](#loans-ödünç-alma)
4.  [Proje Yapısı](#proje-yapısı)
5.  [Mevcut Script'ler](#mevcut-scriptler)

---

## Teknolojiler

-   **Backend:** Node.js, Express.js
-   **Dil:** TypeScript
-   **ORM:** Prisma
-   **Veritabanı:** PostgreSQL
-   **Mimari:** Onion Architecture
-   **Kimlik Doğrulama:** JWT (JSON Web Tokens)

---

## Kurulum Adımları

Bu adımları takip ederek projeyi yerel makinenizde çalışır hale getirebilirsiniz.

### Gereksinimler

-   [Node.js](https://nodejs.org/en/) (v18 veya üstü)
-   [npm](https://www.npmjs.com/) (Node.js ile birlikte gelir)
-   [PostgreSQL](https://www.postgresql.org/download/) veritabanı

### Projeyi Klonlama

```bash
git clone https://github.com/rafetmer/onion-architecture-library.git
cd onion-architecture-library/library-api
```

### Bağımlılıkları Yükleme

Proje için gerekli olan tüm paketleri yükleyin.

```bash
npm install
```

### Ortam Değişkenleri (.env)

Projenin kök dizininde (`library-api/`) `.env` adında bir dosya oluşturun. Bu dosya, veritabanı bağlantı bilgilerinizi ve gizli anahtarlarınızı içerecektir.

**.env.example:**

```
# PostgreSQL veritabanı bağlantı adresiniz
# Format: postgresql://KULLANICI_ADI:SIFRE@SUNUCU:PORT/VERITABANI_ADI
DATABASE_URL="postgresql://postgres:password@localhost:5432/library_db?schema=public"

# JWT için kullanılacak gizli anahtar
JWT_SECRET="COK_GIZLI_BIR_ANAHTAR_GIRIN"
```

Yukarıdaki `DATABASE_URL`'i kendi PostgreSQL kurulumunuza göre güncelleyin.

### Veritabanı Kurulumu

Prisma, veritabanı şemasını sizin için oluşturacaktır. Aşağıdaki komutu çalıştırarak veritabanı tablolarını oluşturun.

```bash
npx prisma migrate dev --name init
```

Bu komut, `prisma/schema.prisma` dosyasını okuyarak veritabanı tablolarını oluşturur.

### Veritabanını Doldurma (Seed)

Test için örnek verilerle veritabanını doldurmak isterseniz aşağıdaki komutu çalıştırın.

```bash
npm run seed
```

Bu komut, `prisma/seed.ts` dosyasındaki verileri veritabanına ekler.

### Sunucuyu Başlatma

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Sunucu varsayılan olarak `http://localhost:3001` adresinde çalışmaya başlayacaktır.

---

## API Kullanımı

### Temel URL

Tüm API endpoint'leri `/api` ön eki ile başlar.
**Örnek:** `http://localhost:3001/api/books`

### Kimlik Doğrulama (Authentication)

Bu API, JWT tabanlı kimlik doğrulama kullanır. Korumalı endpoint'lere erişmek için `Authorization` başlığında bir Bearer Token göndermeniz gerekir.

**Akış:**

1.  `POST /api/auth/register` ile yeni bir kullanıcı oluşturun.
2.  `POST /api/auth/login` ile giriş yapın ve bir JWT (token) alın.
3.  Korumalı endpoint'lere istek yaparken, HTTP başlığına (`Header`) aşağıdaki gibi token'ı ekleyin:
    `Authorization: Bearer <ALINAN_TOKEN>`

### API Endpoint'leri

#### Auth (Kimlik Doğrulama)

| Metot | Endpoint            | Kimlik Doğrulama | Açıklama                  | Request Body (JSON) Örneği                               |
| :---- | :------------------ | :--------------- | :------------------------ | :------------------------------------------------------- |
| `POST`  | `/auth/register`    | **Gerekmez**     | Yeni kullanıcı kaydı yapar. | `{ "email": "test@example.com", "password": "123456", "name": "Test User" }` |
| `POST`  | `/auth/login`       | **Gerekmez**     | Kullanıcı girişi yapar ve JWT döndürür. | `{ "email": "test@example.com", "password": "123456" }` |

#### Users (Kullanıcılar)

| Metot | Endpoint            | Kimlik Doğrulama | Açıklama                  |
| :---- | :------------------ | :--------------- | :------------------------ |
| `GET`   | `/users`            | **Gerekli**      | Tüm kullanıcıları listeler. |
| `GET`   | `/users/:id`        | **Gerekli**      | Belirtilen ID'ye sahip kullanıcıyı getirir. |
| `GET`   | `/users/profile/me` | **Gerekli**      | Giriş yapmış kullanıcının kendi profil bilgilerini getirir. |

#### Books (Kitaplar)

| Metot | Endpoint            | Kimlik Doğrulama | Açıklama                  | Request Body (JSON) Örneği                               |
| :---- | :------------------ | :--------------- | :------------------------ | :------------------------------------------------------- |
| `GET`   | `/books`            | **Gerekmez**     | Tüm kitapları listeler.   |
| `GET`   | `/books/:id`        | **Gerekmez**     | Belirtilen ID'ye sahip kitabı getirir. |
| `POST`  | `/books`            | **Gerekli**      | Yeni bir kitap ekler.     | `{ "title": "Yeni Kitap", "author": "Yazar Adı", "published": "2023-01-01T00:00:00.000Z" }` |
| `PUT`   | `/books/:id`        | **Gerekli**      | Bir kitabı günceller.     | `{ "title": "Güncel Kitap Adı" }`                         |
| `DELETE`| `/books/:id`        | **Gerekli**      | Bir kitabı siler.         |

#### Loans (Ödünç Alma)

| Metot | Endpoint            | Kimlik Doğrulama | Açıklama                  |
| :---- | :------------------ | :--------------- | :------------------------ |
| `POST`  | `/loans/borrow/:bookId` | **Gerekli**      | Belirtilen ID'ye sahip kitabı ödünç alır. |
| `POST`  | `/loans/return/:loanId` | **Gerekli**      | Belirtilen ID'ye sahip ödünç işlemini sonlandırır (kitabı iade eder). |
| `GET`   | `/loans`            | **Gerekli**      | Giriş yapmış kullanıcının tüm ödünç alma geçmişini listeler. |

---

## Proje Yapısı

Proje, sorumlulukların net bir şekilde ayrıldığı Soğan Mimarisi'ne göre yapılandırılmıştır.

-   `src/domain`: Projenin iş kurallarını ve varlıklarını (entities, repositories arayüzleri) içerir.
-   `src/application`: Uygulama servislerini (application services) içerir. İş akışlarını yönetir.
-   `src/infrastructure`: Veritabanı bağlantısı, dış servisler gibi dış dünya ile ilgili kodları içerir. (Örn: Prisma repository implementasyonları).
-   `src/presentation`: API endpoint'leri, controller'lar, middleware'ler ve sunucu yapılandırmasını içerir.

---

## Mevcut Script'ler

`package.json` dosyasında tanımlı olan ve kullanabileceğiniz script'ler:

-   `npm run dev`: Geliştirme sunucusunu `tsx` ile başlatır. Dosya değişikliklerini izler ve sunucuyu otomatik olarak yeniden başlatır.
-   `npm run build`: TypeScript kodunu JavaScript'e derler ve `dist` klasörüne atar.
-   `npm run start`: Derlenmiş JavaScript kodu üzerinden sunucuyu başlatır (production için).
-   `npm run seed`: `prisma/seed.ts` dosyasını çalıştırarak veritabanına başlangıç verilerini ekler.
