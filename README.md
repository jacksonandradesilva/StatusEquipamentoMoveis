# Integração com Firebase — MINA Monitoramento

Este projeto exibe o status de equipamentos móveis. Adicionei integração opcional com Firebase (Firestore) para visualização em tempo real entre dispositivos móveis via web. Se você não configurar o Firebase, a aplicação continuará funcionando localmente usando `localStorage`.

Passos rápidos (resumo):

1. Criar projeto no Firebase
2. Ativar Firestore (modo de teste para desenvolvimento)
3. Registrar uma *Web App* e copiar a configuração (firebaseConfig)
4. Colar a configuração em `index.html` e `nova.html` no objeto `firebaseConfig`
5. (Opcional) Habilitar Hosting e fazer `firebase deploy` para acessar em dispositivos móveis

Detalhado — Como configurar

1) Criar projeto
- Entre em https://console.firebase.google.com/
- Clique em "Adicionar projeto" e siga o assistente

2) Ativar Firestore
- No painel do projeto, vá em "Firestore Database"
- Clique em "Criar banco de dados"
- Escolha modo de testes (durante desenvolvimento). ATENÇÃO: modo de testes permite leitura/escrita pública — restrinja em produção.

3) Registrar a web app e obter config
- Vá em "Configurações do Projeto" > "Seus apps" > clique no ícone "</>" (Web)
- Dê um nome e registre
- Copie o bloco de configuração (firebaseConfig) — será parecido com:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

4) Colar a configuração
- Abra `index.html` e `nova.html`
- Localize o objeto `firebaseConfig` (comentado) e cole os valores fornecidos pelo Firebase
- Salve os arquivos

Observação: os scripts SDK já foram adicionados no `<head>` das páginas (compat build). Ao colar o `apiKey` a aplicação passará a usar Firestore.

5) Segurança (regras do Firestore)
- Para testes rápidos use as regras de teste (curto prazo):

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

- Em produção, configure regras baseadas em autenticação para evitar acesso público.

6) Acessar pelo celular
- Opção simples: hospede os arquivos com Firebase Hosting (recomendado) ou qualquer host estático.

Deploy com Firebase Hosting (opcional):
- Instale Firebase CLI: `npm install -g firebase-tools`
- Faça login: `firebase login`
- Inicialize o projeto no diretório: `firebase init` (escolha Hosting, aponte para a pasta com `index.html`)
- Deploy: `firebase deploy` — receberá uma URL pública para abrir no celular

Teste local (sem deploy)
- Você pode abrir `index.html` no navegador, mas para sincronizar entre dispositivos é necessário hospedar (Firebase Hosting ou outro servidor acessível pela rede).
- Para testar local com servidor simples (Windows PowerShell):

```powershell
# Usando Python (se instalado)
python -m http.server 8000
# Abra no navegador do PC: http://localhost:8000
# Para abrir no celular na mesma rede, use http://<IP-do-PC>:8000
```

Observações finais
- Atualmente a coleção usada no Firestore é `equipamentos`. O documento por padrão usa o `TAG` (nome) como id de documento: assim atualizações por TAG sobrescrevem o registro.
- Se quiser melhorar: use autenticação (Firebase Auth), armazene timestamps nativos (`serverTimestamp()`), e restrinja regras.

Se quiser, eu posso:
- adicionar autenticação por e-mail (Firebase Auth)
- ajustar rules de segurança
- preparar `firebase.json` e iniciar hosting com `firebase init` neste diretório

---
Feito por Copilot — se quiser que eu cole sua `firebaseConfig` diretamente nos arquivos, cole os valores aqui e eu aplico para você.