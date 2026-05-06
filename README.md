# Projeto de Infraestrutura DevOps para API

Este projeto demonstra um fluxo DevOps completo usando uma API em Node.js, Docker, Kubernetes, GitHub Actions, Terraform, AWS EC2, VPC, Security Groups e Nginx como proxy reverso.

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
- Kubernetes
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

## Kubernetes com Kind

Além do deploy na AWS EC2, este projeto também possui manifests Kubernetes para executar a aplicação localmente em um cluster criado com Kind.

O objetivo desta etapa é demonstrar conhecimentos em Kubernetes, incluindo:

- Deployment
- Service
- Replicas
- Liveness Probe
- Readiness Probe
- Resource Requests
- Resource Limits

## Estrutura dos Manifests Kubernetes

Os arquivos Kubernetes estão na pasta:

```bash
k8s/
```

Arquivos criados:

```txt
k8s/
├── deployment.yaml
└── service.yaml
```

## Deployment

O arquivo `deployment.yaml` define como a aplicação será executada dentro do cluster Kubernetes.

Ele configura:

- 2 réplicas da aplicação
- Imagem Docker da API
- Porta interna do container
- Readiness Probe
- Liveness Probe
- Requests e limits de CPU/memória

Exemplo de recursos configurados:

```yaml
replicas: 2
```

Isso faz com que o Kubernetes mantenha 2 pods da aplicação rodando.

## Service

O arquivo `service.yaml` expõe a aplicação dentro do cluster usando um Service do tipo `NodePort`.

A aplicação roda internamente na porta:

```txt
3000
```

E é exposta pelo NodePort:

```txt
30080
```

## Criando o Cluster com Kind

Instale o Kind:

```bash
brew install kind
```

Crie o cluster:

```bash
kind create cluster --name devops-api-cluster
```

Verifique se o cluster está funcionando:

```bash
kubectl get nodes
```

## Build da Imagem Docker

Crie a imagem Docker localmente:

```bash
docker build -t devops-api-project:latest .
```

Carregue a imagem para dentro do cluster Kind:

```bash
kind load docker-image devops-api-project:latest --name devops-api-cluster
```

## Aplicando os Manifests

Aplique o Deployment:

```bash
kubectl apply -f k8s/deployment.yaml
```

Aplique o Service:

```bash
kubectl apply -f k8s/service.yaml
```

Verifique os pods:

```bash
kubectl get pods
```

Verifique os services:

```bash
kubectl get services
```

## Acessando a Aplicação no Kubernetes

Use port-forward para acessar a aplicação localmente:

```bash
kubectl port-forward service/devops-api-service 8080:3000
```

Depois acesse no navegador:

```txt
http://localhost:8080/health
```

## Observação sobre Pods e Services

O projeto usa:

```yaml
replicas: 2
```

Por isso, ao rodar:

```bash
kubectl get pods
```

serão exibidos 2 pods da aplicação.

Ao rodar:

```bash
kubectl get services
```

aparecem normalmente 2 services:

```txt
devops-api-service
kubernetes
```

O `devops-api-service` é o service criado para a aplicação.

O service `kubernetes` é criado automaticamente pelo próprio cluster e é usado internamente pelo Kubernetes.

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
