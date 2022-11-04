Kommandoen `psql` åbner CLI tool for postgres. 

Der bliver nød til at være en database user der svarer til den system user man er, før at man kan tilgå databasen. Hvis der ikke er det, og man kører `psql` får man følgende fejl:
```
s164420@se2-e ~ $ psql                                                                                                     │ akari_solution.zip         L02-code-mid.zip    L03-verifiers              note
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "s164420" does not exi│s
st       
```

Som udgangspunkt, sætter posgresql en system user op som hedder `postgres`. 

Derfor starter vi med at blive den system user: 
`sudo -u postgres -i`

Derefter kan vi sige 
```
psql
createuser lira
```

Nu hvor vi er i gang, lad os lave lira brugeren til superuser.

```
ALTER USER librarian WITH SUPERUSER;
```

vi kan nu exite psql, exitte postgres brugeren så vi er lira igen og lave en database:

`createdb liradb`

Nu kan vi connecte til den med:

`psql liradb lira`

Nu kan vi så køre:

`CREATE TABLE calculations ( trip_id varchar(500) primary key, power real );`

Hvis kommandoen fejler med at du ikke har nok privilleges er det måske fordi at du er kommet til at køre createdb mens at du var postgres brugeren og ikke lira brugeren. 

Lad os indsætte noget test data:
`insert into calculations (trip_id, power) values ('abcd-efgh-ijkl-mnop', 10.0);`


