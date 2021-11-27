# API-AULAS

## Para começar digite:
 ```
npm start
 ```

## Para rodar os testes digite:
 ```
npm test 
npm test:cov
 ```

### Sobre a API:

A api é uma representação de um backend de aulas, com professores e usuarios comuns; Onde um professor pode criar uma aula e um usuario pode visualizar e dar uma nota (0 a 5), na api essa nota é chamada de estrelas, possibilitando tambem que o usuario favorite a aula caso ele goste.

- Para os usuarios a api deve permitir:
    - [x] O cadastro de um novo usuario.
    - [x] A listagem de todos os usuarios cadastrados.
    - [x] A listagem de todos os usuarios não professores cadastrados.
    - [x] A remoção de um usuario pelo id do usuario.
    - [x] A atualização de um usuario.
    - [x] Que um usuario se torne professor.

<br>

- Para as aulas a api deve permitir: 
    - [x] A listagem de todas as aulas ordenadas pelo titulo e pela pontuação em ordem ASC ou DESC.
    - [x] O retorno de uma aula pelo ID da aula
    - [x] o retorno da aula com mais votos da aplicação.
    - [x] o retorno de todas as aulas de um determinado professor.
    - [x] o retorno de todas as aulas favoritas de um determinado usuario.
    - [x] A criação de uma nova aula apenas com um usuario denominado professor.
    - [x] Que um usuario favorite uma aula.
    - [x] Que um usuario dê uma nota de 0 a 5 para uma aula.
    - [x] Que um usuario remova a aula de seus favoritos.
    - [x] A remoção de uma aula pelo id da aula.
    - [x] A atualização de uma aula existente.

---

## Rotas de Usuarios

GETTERS

- #### **(GET) /users**
    - ####  retorna todos os usuarios

- #### **(GET) /users/normal**
    - #### retorna todos os usuarios que não são professores


POST

- #### **(POST) /users**
    - #### cria um usuario e retorna o seu id
    - (body) : 
        ``` 
        {
            "name": "Ronaldo",
            "surname": "Giovani",
            "teacher": false
        }
        ```
DELETE

- #### **(DEL) /users**
    - #### remove um usuario existente pelo id e retorna TRUE
    - (body) : 
         ``` 
        {
            "id": "61a0686f44b6046e0341f9f8"
        }
        ```
PUT

- #### **(PUT) /users**
    - #### atualiza um usuario existente e retorna TRUE
    - (body) : 
        ``` 
        {
            "_id": "61a0686f44b6046e0341f9f8",
            "name": "Leonardo",
            "surname": "Oliveira",
            "teacher": false
        }
        ```

- #### **(PUT) /users/becomeTeacher**
    - #### Torna um usuário professor e retorna TRUE
    - (body) : 
         ``` 
        {
            "userId": "61a0686f44b6046e0341f9f8"
        }
        ```

---

## Rotas de Aulas

GETTERS

- #### **(GET) /classes?**
    - ####  retorna e ordena todas as aulas pelo titulo
    - (query params) : 
        ``` 
       order=desc | asc
        ```

- #### **(GET) /classes/stars?**
    - ####  retorna e ordena todas as aulas pelas estrelas
    - (query params) : 
        ``` 
       order=desc | asc
        ```

- #### **(GET) /classes/id/?**
    - ####  retorna uma aula pelo id da aula
    - (query params) : 
        ``` 
       id=61a2955d0efc2ecd22440d5b
        ```

- #### **(GET) /classes/byteacher/?**
    - ####  retorna todas as aulas de um professor pelo id do professor
    - (query params) : 
        ``` 
       id=61a0686f44b6046e0341f9f8
        ```

- #### **(GET) /classes/fav?**
    - ####  retorna todas as aulas favoritas de um usuario pelo id do usuario
    - (query params) : 
        ``` 
       userId=619fe3a87832e9827bc13d6a
        ```

- #### **(GET) /classes/mostVoted**
    - ####  retorna a aula que contem o maior numero de estrelas da aplicação

POST

- #### **(POST) /classes**
    - #### cria uma aula e retorna o seu id
    - (body) : 
        ``` 
        {
            "title": "JS aula",
            "description": "básico de js",
            "teacherId": "61a0686f44b6046e0341f9f8"
        }
        ```

- #### **(POST) /classes/fav**
    - #### Define uma aula como sendo a favorita do usuario, retorna TRUE
    - (body) : 
        ``` 
        {
            "userId": "619fe3a87832e9827bc13d6a",
            "classId": "61a2955d0efc2ecd22440d5b"
        }
       ```

- #### **(POST) /classes/vote**
    - #### Define uma nota de 0 a 5 dada por um usuario para uma aula, retorna TRUE
    - (body) : 
        ``` 
        {
            "userId": "619fe3a87832e9827bc13d6a",
            "classId": "61a2955d0efc2ecd22440d5b",
            "amount": 5
        }
        ```

DELETE

- #### **(DEL) /classes**
    - #### remove uma aula existente pelo id e retorna TRUE
    - (body) : 
         ``` 
        {
            "id": "61a2955d0efc2ecd22440d5b"
        }
        ```


PUT

- #### **(PUT) /classes**
    - #### atualiza uma aula existente e retorna TRUE
    - (body) : 
        ``` 
        {
            "_id": "61a2955d0efc2ecd22440d5b",
            "title": "aula editada",
            "description": "editando a aula",
            "teacherId": "61a0686f44b6046e0341f9f8",
            "stars": 0
        }
        ```