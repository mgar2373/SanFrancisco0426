# 🚀 Guia de publicació — Mobilitat SF 25-26
## De 0 a URL pública en ~20 minuts

---

## PAS 1 — Crea el compte a Supabase (base de dades + autenticació)

1. Ves a **https://supabase.com** → "Start your project" → Registra't (gratis)
2. Clica **"New project"**
   - Nom: `sf-mobility`
   - Password: (genera'n un i guarda'l)
   - Regió: `West EU (Ireland)` ← la més propera
3. Espera ~2 minuts que s'inicialitzi

4. Ves a **SQL Editor** → **New query**, enganxa el contingut de `supabase-setup.sql` i clica **Run**

5. Ves a **Settings → API** i copia:
   - `Project URL` → és el teu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → és el teu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → és el teu `SUPABASE_SERVICE_ROLE_KEY` ⚠️ mai el comparteixis

6. A **Authentication → Email Templates**, personalitza si vols el correu de benvinguda

---

## PAS 2 — Prepara el projecte al teu ordinador

Necessites tenir instal·lat: **Node.js** (https://nodejs.org, versió 18+) i **Git**

```bash
# Obre el Terminal i executa:

# Navega a on vols tenir el projecte
cd ~/Documents

# Copia la carpeta del projecte aquí (o descarrega-la de Claude)
# El nom de la carpeta ha de ser "sf-mobility-project"

# Entra a la carpeta
cd sf-mobility-project

# Instal·la les dependències
npm install

# Crea el fitxer de variables d'entorn
cp .env.example .env.local
```

3. Obre `.env.local` amb qualsevol editor de text i omple els 3 valors de Supabase del pas 1.

4. Prova en local:
```bash
npm run dev
```
Obre http://localhost:3000 — hauries de veure l'app! ✅

---

## PAS 3 — Fes-te admin

1. A http://localhost:3000, clica **"Iniciar sessió"** → **"Sol·licitar accés"**
2. Registra't amb el teu email (`mgar2373@xtec.cat`) i una contrasenya
3. Torna a Supabase → **SQL Editor** → executa:
   ```sql
   UPDATE public.profiles
   SET approved = TRUE, role = 'admin'
   WHERE email = 'mgar2373@xtec.cat';
   ```
4. Refresca l'app → ara apareixerà el botó **"👤 Admin"** a la capçalera

---

## PAS 4 — Publica a Vercel (gratis)

1. Ves a **https://vercel.com** → "Start Deploying" → Registra't amb GitHub

2. Puja el projecte a GitHub:
```bash
# A la carpeta sf-mobility-project:
git init
git add .
git commit -m "Mobilitat SF 25-26 — versió inicial"
```
   - Crea un repositori **privat** a https://github.com/new
   - Segueix les instruccions de GitHub per pujar el codi

3. A Vercel → **"Add New Project"** → importa el repositori de GitHub

4. A **"Environment Variables"** afegeix les 3 variables del teu `.env.local`

5. Clica **"Deploy"** → espera ~2 minuts

6. 🎉 La teva URL serà: `https://sf-mobility.vercel.app` (o similar)

---

## COM GESTIONAR ELS USUARIS

### Quan algú sol·licita accés:
- L'app guarda el seu perfil a Supabase amb `approved = false`
- Inicia sessió a l'app → clica **"👤 Admin"** → veuràs les sol·licituds pendents
- Clica **"✅ Aprovar"** → l'usuari podrà editar a partir d'ara

### Per revocar l'accés:
- Al panell d'admin → clica "Revocar accés"

### Per fer admin un altre participant:
- Al panell d'admin → clica "Fer admin"

---

## RESUM DE PERMISOS

| Acció | Visitant anònim | Usuari aprovat | Admin |
|-------|:-:|:-:|:-:|
| Veure contingut | ✅ | ✅ | ✅ |
| Afegir al diari | ❌ | ✅ | ✅ |
| Gestionar despeses | ❌ | ✅ | ✅ |
| Editar CRM | ❌ | ✅ | ✅ |
| Aprovar usuaris | ❌ | ❌ | ✅ |
| Fer admin | ❌ | ❌ | ✅ |

---

## NECESSITES AJUDA?

Escriu a Claude amb qualsevol error que et surti i ho solucionem pas a pas.
