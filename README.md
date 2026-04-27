# 📝 Notes App Pro – CheckPoint 5
 
> **FIAP · Tecnologia em Desenvolvimento de Sistemas – 2TDS**
> Disciplina: Mobile Application Development | Professor: Fernando Pinéo
 
---
 
## 👥 Integrantes
 
| Nome | RM |
|------|----|
| Victor Rodrigues De Lima Lourenco | RM560087 |
| Luann Noqueli Klochko | RM560313 |
| Lucas Higuti Fontanezi | RM561120 |
 
---
 
## 📱 Sobre o Projeto
 
Aplicativo de notas profissional desenvolvido com **React Native + Expo**, com suporte a múltiplos idiomas, geolocalização, notificações push e distribuição via APK.
 
---
 
## ✅ Funcionalidades Implementadas
 
### 🌐 Internacionalização (i18n) — 2.0 pts
- Suporte completo a **Português 🇧🇷** e **Inglês 🇺🇸**
- Nenhuma string está fixa no código (todas em `src/i18n/pt.ts` e `src/i18n/en.ts`)
- Seletor de idioma na tela de **Configurações**
- Mudança dinâmica em tempo real sem restart
- Detecção automática do idioma do dispositivo
### 🗺️ Mapas e Geolocalização — 2.5 pts
- **Captura automática** de latitude/longitude ao salvar nota
- **Geocoding reverso** incluído (converte coordenadas em endereço de rua/cidade) — bônus 0.5 pts
- Coordenadas persistidas no **Firestore** junto à nota
- Botão "Ver no mapa" em cada nota
- Mapa com **Pin (Marker)** na localização exata onde a nota foi criada
- Solicitação de permissão de localização com mensagem amigável
### 🔔 Notificações (Push & Local) — 2.5 pts
- Integração com **Expo Notifications**
- Notificação de **"Boas-vindas"** disparada após login autenticado
- Notificação de **confirmação** ao criar nota com sucesso
- Solicitação de permissão de notificação amigável
- Canal Android configurado com vibração e cor de destaque
### 📦 Geração do APK — 2.0 pts
- Configurado via **EAS Build**
- Perfil `preview` gera `.apk` para distribuição interna
- Comando: `eas build --profile preview --platform android`
### 📄 Organização e Documentação — 1.0 pt
- README completo com instruções
- Estrutura de código organizada por responsabilidade
- Hooks separados por domínio (notas, localização, notificações)
---
 
## 🎁 Funcionalidades Extras
 
| Extra | Pontos | Status |
|-------|--------|--------|
| Geocoding (endereço na nota) | 0.5 | ✅ Implementado |
| Agendamento de lembretes | 0.5 | ✅ Código disponível em `useNotifications.ts` |
 
---
 
## 🛠️ Tecnologias
 
| Tecnologia | Uso |
|-----------|-----|
| React Native + Expo | Framework principal |
| expo-router | Navegação baseada em arquivos |
| i18next + react-i18next | Internacionalização |
| react-native-maps | Visualização de mapas |
| expo-location | GPS e geocoding |
| expo-notifications | Notificações locais e push |
| Firebase Auth | Autenticação |
| Firebase Firestore | Banco de dados em nuvem |
| EAS Build | Geração do APK |
 
---
 
## 🚀 Como Rodar o Projeto
 
### Pré-requisitos
- Node.js 18+
- Conta Firebase
### 1. Clone e instale dependências
```bash
git clone https://github.com/luannoq/Projeto_de_notas.git
cd Projeto_de_notas
npm install --legacy-peer-deps
```
 
### 2. Configure o Firebase
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Copie as credenciais para `src/config/firebase.ts`
3. Coloque o `google-services.json` na raiz do projeto
4. Ative **Authentication** (Email/Senha) e **Firestore**
### 3. Rode o projeto
```bash
npx expo start
```
 
---
 
## 📦 Gerar o APK
 
```bash
eas build --profile preview --platform android
```
 
---
 
## 🔗 APK para Download
 
> Link: https://expo.dev/accounts/luannoq/projects/notes-app-pro/builds/48c14c03-dbdd-4801-a1cc-5abee82b026b
 
---
 
## 🏗️ Estrutura do Projeto
 
```
notes-app/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx        # Tela de login
│   │   └── register.tsx     # Tela de cadastro
│   ├── (app)/
│   │   ├── notes.tsx        # Tela principal de notas
│   │   └── settings.tsx     # Configurações (idioma, logout)
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── config/firebase.ts
│   ├── hooks/
│   │   ├── useNotes.ts
│   │   ├── useLocation.ts
│   │   └── useNotifications.ts
│   ├── components/
│   │   ├── NoteCard.tsx
│   │   └── MapModal.tsx
│   └── i18n/
│       ├── pt.ts
│       └── en.ts
├── app.json
├── eas.json
└── package.json
```
 
---
 
## 📋 Regras do Firestore
 
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```