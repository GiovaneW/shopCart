# shopCart
Carrinho de compras para ecomerce


# Instruções de instalação

# Requisitos
- Docker
- Node
- npm

# Instalando as dependências
- Depois de feito o clone do rpojeto execute o comando de instalação das dependências no terminal dentro da pasta onde o clone foi feito

    ```$ npm ci```


# Variaveis de ambiente
- Faça uma cópia do arquivo env.example renomeando-o para .env apenas
- Atribua valores as varáveis de banco de dados, lembre-se que usaremos postgres para este projeto então se voê for seguir todas as instruções abaixo recomenda-se utilizar 
as informações que já estão atribuidas como exemplo, caso você for alterar qualquer uma delas, será necessário modificar os valores contidos no 
arquivo './src/config/database/config.json' conforme as novas informações qeu você definir no arquivo de variaveis de ambiente 

# Banco de dados
- Depois de instaladas as dependências do projeto vamos criar o container de docker que vai rodar o nosso banco local e persistir nossos dados, 
para isso, abra um terminal de comando na pasta do projetoe siga os passos abaixo

- Para criar o container execute o seguinte comando
 
    ```$ npm run docker-db```


- Para criar o banco de dados dentro do container execute o seguinte comando
 
    ```$ npm run create-db```


- Para rodar as migrations execute o seguinte comando
 
    ```$ npm run migrations```


- Para rodar os seeders execute o seguinte comando
 
    ```$ npm run seeds```


# Executando o build do projeto
- Para rodar o build do codigo typescript basta executar o comando a seguir em um terminal de comnado na pasta do projeto
- Este comando irá rodar um linter no projeto e ira transpilar todo o nosso codigo typescript para um javascript otimizado para o node (o node roda apenas codigos em javascript)
- O código buildado estará em uma pasta na raiz do projeto chamada 'build'


    ```$ npm run build```


# Executando o projeto
- Para rodar o projeto em ambiente de desenvolvimento fazemos uso de um server que executa nosso projeto em typescript fazendo uma transpilação em tempo real e reiniciando o 
projeto sempre que uma alteração no código é detenctada (quando você salvar o qualquer arquivo alterado que já esteja sendo importado na execução)

    ```$ npm run dev```



# Regras de commits
- Para cada novo commit utilize os seguintes prefixos

- feat/feature: utilizado para comitar toda ou parte de um nova feature
- fix: correção de erros em códigos já comitados dentro da feature (antes do Pull Request)
- bugfix: correção de erros em uma feature depois que a PR de lançamento da feature já foi feita para a dev
- hotfix: correção de erros para a main do projeto
- tests: commit de código de testes
- project: para alterações da estrutura/organização do projeto
- devops: comits que tratam de alterações da parte dos pipelines de automação

Ps.: não há um linter de comandos configurado ainda mas se você não utilizar os prefixos corretos sua PR não será aprovada