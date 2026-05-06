# Projeto de Infraestrutura DevOps para API

Este projeto demonstra um fluxo DevOps completo usando uma API simples em Node.js, Docker, GitHub Actions, Terraform, AWS EC2, VPC, Security Groups e Nginx como proxy reverso.

## Visão Geral do Projeto

O objetivo deste projeto é realizar o deploy de uma API containerizada na AWS usando provisionamento de infraestrutura automatizado e práticas de CI/CD.

A aplicação é uma API simples em Node.js que roda dentro de um container Docker. A infraestrutura é criada com Terraform, e os deploys são automatizados com GitHub Actions.

## Tecnologias Utilizadas

- Node.js
- Express.js
- Docker
- GitHub Actions
- AWS EC2
- AWS VPC
- AWS Subnet
- AWS Internet Gateway
- AWS Route Table
- AWS Security Group
- Terraform
- Nginx
- Linux Ubuntu

## Arquitetura

```txt
Internet
   |
   | HTTP :80
   v
Instância EC2 na AWS
   |
   v
Nginx como Proxy Reverso
   |
   | localhost:3000
   v
Container Docker
   |
   v
API Node.js
```

## Infraestrutura

A infraestrutura é criada usando Terraform.

O Terraform provisiona:

- VPC
- Subnet pública
- Internet Gateway
- Route Table pública
- Security Group
- Instância EC2
- Script `user_data` para instalar Git, Docker e Nginx automaticamente

## Regras do Security Group

Regras de entrada atuais:

| Tipo | Porta | Origem | Descrição |
|---|---:|---|---|
| SSH | 22 | Meu IP | Usado para acessar a instância EC2 |
| HTTP | 80 | 0.0.0.0/0 | Acesso público através do Nginx |

A aplicação roda internamente na porta `3000`, mas essa porta não fica exposta publicamente para a internet. Apenas o Nginx acessa a aplicação internamente por meio de `localhost:3000`.

## Pipeline CI/CD

O projeto usa GitHub Actions para fazer o deploy automático da aplicação.

Quando um código é enviado para a branch `main`, a pipeline:

1. Acessa a instância EC2 via SSH
2. Atualiza o código com `git pull`
3. Para o container Docker antigo
4. Remove o container Docker antigo
5. Cria uma nova imagem Docker
6. Sobe um novo container Docker
7. Mantém a API disponível por meio do Nginx na porta `80`

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Retorna uma mensagem inicial |
| GET | `/health` | Retorna o status de saúde da aplicação |
| GET | `/tasks` | Retorna uma lista de tarefas |
| POST | `/tasks` | Cria uma nova tarefa |

## Rodando Localmente

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

Acesse a API:

```txt
http://localhost:3000
```

## Rodando com Docker

Crie a imagem Docker:

```bash
docker build -t devops-api-project .
```

Execute o container:

```bash
docker run -d -p 3000:3000 --name devops-api devops-api-project
```

Teste a API:

```bash
curl http://localhost:3000/health
```

## Uso do Terraform

Entre na pasta do Terraform:

```bash
cd terraform
```

Inicialize o Terraform:

```bash
terraform init
```

Formate os arquivos:

```bash
terraform fmt
```

Valide a configuração:

```bash
terraform validate
```

Visualize as mudanças que serão feitas na infraestrutura:

```bash
terraform plan
```

Aplique a infraestrutura:

```bash
terraform apply
```

Destrua a infraestrutura:

```bash
terraform destroy
```

## Secrets do GitHub Actions

Os seguintes secrets precisam ser configurados no repositório:

| Secret | Descrição |
|---|---|
| `EC2_HOST` | IP público da instância EC2 |
| `EC2_USER` | Usuário SSH da instância, normalmente `ubuntu` |
| `EC2_SSH_KEY` | Chave privada SSH usada para acessar a instância EC2 |

## Status Atual do Projeto

- API criada com Node.js e Express
- Dockerfile criado
- Aplicação rodando com Docker
- EC2 provisionada com Terraform
- VPC própria criada
- Subnet pública criada
- Internet Gateway criado
- Route Table pública configurada
- Security Group configurado
- Git, Docker e Nginx instalados automaticamente com `user_data`
- Nginx configurado como proxy reverso
- Porta `3000` fechada para acesso público
- Pipeline CI/CD criada com GitHub Actions
- Deploy automático para AWS EC2 funcionando