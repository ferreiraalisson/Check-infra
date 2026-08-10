# Zelo-Infra

**Sistema web para inspeção e gestão de infraestrutura**

> O Zelo-Infra surgiu a partir de uma demanda operacional para digitalizar inspeções periódicas de infraestrutura e centralizar o registro de ocorrências em uma unidade educacional.

**Repositório:** `Check-infra`

---

## 📌 Contexto

O projeto começou a partir de uma demanda para criar um checklist periódico de infraestrutura.

Antes de criar uma nova planilha, procurei entender os controles que já existiam na unidade. Já havia registros relacionados a chamados, demandas da Engenharia e rondas dos ambientes. Além disso, também constatei que havia pontos que não eram contemplados nas planilhas existentes.

A partir dessa análise, percebi que criar mais uma planilha poderia gerar informações repetidas e aumentar o trabalho necessário para manter os registros atualizados.

A unidade possui um prédio de 10 andares, com salas e laboratórios, além do térreo, terraço e subsolo. Por isso, em vez de tentar criar uma rotina que exigisse a inspeção diária de todos os ambientes, procurei identificar quais pontos eram mais críticos para a operação.

---

## 🎯 Problema

A necessidade inicial era criar uma forma de acompanhar periodicamente pontos relevantes da infraestrutura sem aumentar excessivamente a carga operacional da equipe.

A partir do levantamento, foram definidos pontos críticos para acompanhamento, como:

- Hidrômetro;
- Elevatória da cisterna;
- Portas e acessos;
- Elevador PCD;
- Bomba de drenagem;
- Subestação;
- Cisterna;
- Banheiros;
- Calhas;
- Caixa de gordura;
- Caixa d'água;
- CPD;
- Poço do elevador.

Para cada ponto foram definidos os dados que realmente precisavam ser registrados, evitando transformar a inspeção em uma coleta excessiva de informações.

---

## 💡 Primeira solução: Planilha Excel

A primeira versão foi estruturada no **Excel**.

Após a montagem da planilha e sua apresentação, a solução foi aprovada para iniciar as inspeções.

Porém, a utilização em campo revelou um novo problema.

O responsável pela inspeção fazia a ronda, anotava as informações e posteriormente precisava transferi-las para a planilha.

Esse processo adicionava uma etapa que poderia ser eliminada.

A partir desse feedback surgiu uma nova necessidade:

> Como permitir que o registro fosse feito diretamente pelo smartphone durante a inspeção?

---

## 🔄 Evolução para uma aplicação web

Foi a partir desse feedback que pensei em transformar a planilha em uma aplicação web.

Assim surgiu o **Zelo-Infra**, uma interface responsiva desenvolvida para permitir que os registros fossem realizados diretamente pelo smartphone.

Na construção da interface, procurei reduzir a necessidade de digitação. Informações que possuíam respostas recorrentes foram transformadas em opções de seleção, como:

- Aberto / Fechado;
- Bomba 1 / Bomba 2;
- Sim / Não;
- Condição;
- Observações.

A ideia era tornar a interação mais rápida e simples para quem utilizaria o sistema durante a ronda.

---

## 🏗️ Arquitetura

A aplicação utiliza uma arquitetura simples, definida também pelas restrições do ambiente em que o projeto foi desenvolvido.

```text
Smartphone
    ↓
HTML / CSS / JavaScript
    ↓
Google Apps Script
    ↓
Google Sheets
```

### Front-end

- HTML5
- CSS3
- JavaScript

A escolha por tecnologias sem framework permitiu realizar alterações com maior facilidade e testar funcionalidades durante o desenvolvimento.

Também foi uma decisão relacionada às restrições da estação de trabalho corporativa, que não permitia instalação livre de ferramentas ou utilização de CLI.

Por esse motivo, tecnologias como React, Python e Docker não foram utilizadas nessa solução específica.

### Back-end

**Google Apps Script**

Utilizado para implementar a lógica de back-end e disponibilizar a aplicação como Web App, permitindo a comunicação entre a interface e os dados.

### Persistência

**Google Sheets**

A escolha do Google Sheets permitiu manter os dados em uma ferramenta já conhecida pela organização, além de facilitar o compartilhamento e o acesso por pessoas com diferentes níveis de familiaridade com tecnologia. Por isso, não houve o armazenamento num banco de dados, para permitir que os registros pudessem ser verificados com facilidade por colaboradores leigos.

---

## 🧪 Problemas encontrados durante o desenvolvimento

A utilização real do sistema revelou problemas que não estavam previstos inicialmente.

### Persistência

Em situações de conexão instável, havia risco de perda das informações preenchidas.

Foi necessário implementar mecanismos de **persistência local** para reduzir esse problema.

### Falhas no envio

Foram identificadas situações em que os dados não eram enviados corretamente.

A aplicação passou a contar com mecanismos de tratamento e recuperação para reduzir o impacto dessas falhas.

### Upload de imagens

O envio de imagens apresentou problemas relacionados ao tamanho dos arquivos e ao tempo necessário para processamento.

Foram implementados:

- Compressão de imagens;
- Tratamento de falhas;
- Fallbacks;
- Tratamento de situações de timeout.

### Tratamento e proteção dos dados

Durante a evolução do projeto também identifiquei a necessidade de reduzir a exposição dos dados.

Foram implementados mecanismos de cifragem/tratamento dos dados e ajustes na separação entre informações de controle interno e informações destinadas à visualização.

> **Observação:** detalhes de implementação relacionados à segurança não são expostos neste repositório quando podem revelar informações sensíveis da infraestrutura ou do ambiente corporativo.

---

## 🎨 UX e evolução da interface

A interface não foi definida apenas a partir de uma proposta inicial.

Ela foi sendo ajustada conforme o sistema era utilizado.

A partir da experiência do usuário, foram realizados ajustes relacionados a:

- Layout;
- Tipografia;
- Organização dos elementos;
- Quantidade de informações exibidas;
- Facilidade de interação;
- Utilização em smartphones.

O processo acabou seguindo um ciclo de:

```text
Desenvolvimento
      ↓
Utilização
      ↓
Feedback
      ↓
Identificação de problemas
      ↓
Ajustes
      ↓
Nova utilização
```

---

## 📋 Módulo Ocorrências

Após a implementação do checklist, percebi que ainda existiam problemas cotidianos que não se encaixavam na funcionalidade inicial.

Exemplos:

- Lâmpada queimada;
- Cadeira danificada;
- Problemas em equipamentos;
- Outras irregularidades encontradas durante a rotina.

Essas demandas poderiam chegar por WhatsApp, e-mail ou comunicação verbal, deixando as informações dispersas.

A partir disso, foi desenvolvido o módulo **Ocorrências**.

A funcionalidade permite registrar informações como:

- Local;
- Categoria;
- Descrição;
- Imagem;
- Identificação do responsável pelo registro.

A ideia passou a ser:

```text
Identificar
    ↓
Registrar
    ↓
Centralizar
    ↓
Acompanhar
```

---

## 📝 Próxima evolução: módulo de tarefas

A próxima funcionalidade planejada é um módulo de **tarefas**.

A necessidade surgiu porque algumas atividades ficam disperas ao serem encaminhadas ao responsável pela manutenção e com o tempo podem se perder. A ideia é centralizar e sempre ter o registro para relembrar e quando for feita ser sinalizada.

A proposta é centralizar esse fluxo:

```text
Demanda
   ↓
Filtragem
   ↓
Tarefas
   ↓
Execução
   ↓
Status
```

Com isso, será possível acompanhar não apenas o que foi solicitado, mas também se a atividade foi realizada.

---

## 🛠️ Tecnologias e conceitos aplicados

### Desenvolvimento

- HTML5
- CSS3
- JavaScript
- Google Apps Script

### Integração e dados

- Google Sheets
- Web App
- API REST
- Persistência local

### Interface e experiência

- Design responsivo
- Interface mobile
- Simplificação de interação
- Feedback de usuário
- Melhoria contínua

### Qualidade e tratamento de falhas

- Testes em ambiente real
- Identificação de bugs
- Debugging
- Tratamento de erros
- Fallbacks
- Tratamento de timeout
- Compressão de imagens

### Segurança

- Tratamento/cifragem de dados
- Separação entre dados internos e dados destinados à visualização

---

## 📚 Aprendizados

O projeto começou como uma demanda para criação de uma planilha e acabou se transformando em uma aplicação utilizada em um processo real.

Uma das principais aprendizagens foi perceber que desenvolver uma solução não significa apenas implementar aquilo que foi solicitado inicialmente.

Foi necessário compreender o processo, identificar o problema real, observar o usuário utilizando a solução, lidar com as restrições do ambiente, encontrar falhas e adaptar o sistema a partir dessas descobertas.

Esse processo permitiu vivenciar na prática etapas relacionadas a:

- Levantamento de requisitos;
- Análise de processos;
- Desenvolvimento;
- UX;
- Testes;
- Debugging;
- Tratamento de falhas;
- Validação com usuário;
- Melhoria contínua.

---

## 🚀 Próximos passos

- Implementação do módulo de tarefas;
- Continuidade dos testes a partir da utilização real;
- Validação de dados no front e no armazenamento dos dados;
- Aprimoramento dos mecanismos de tratamento de falhas;
- Evolução dos controles de segurança;
- Evolução do acompanhamento das ocorrências;
- Melhorias de UX.
  
---

## 👤 Sobre o projeto

**Zelo-Infra** é o nome da aplicação.

O projeto está publicado no GitHub como **Check-Infra (`check-infra`)**.

A diferença entre os nomes é intencional: **Zelo-Infra** representa o produto/aplicação, enquanto **Check-Infra** identifica o projeto e seu repositório.

---

> Projeto desenvolvido como uma experiência prática de transformação de um processo operacional em uma solução digital, evoluindo a partir de requisitos, utilização real, feedback do usuário, testes e identificação de problemas.
