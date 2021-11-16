
// (async() => {
// 	await sql.connect(`Server=${DB_HOST},${DB_PORT};Database=${DB_NAME};User Id=${DB_USER};Password=${DB_PASSWORD};Encrypt=true;Integrated Security=true;Pooling=true;CommandTimeout=20;SSL=true`)
// 	const result = await sql.query('SELECT * FROM public."Measurements" where "FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'')
// 	console.log(result);

// })()



/*
const database = knex({
	client: 'postgres',
	connection: {
	  host : DB_HOST,
	  user : DB_USER,
	  password : DB_PASSWORD,
	  database : DB_NAME
	}
  });

console.log(database);

// need to use await database.select... but throws EHOSTUNREACH
// 'SELECT * FROM public."Measurements" where "FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'',
const res = database.select('*').from('public."Measurements"').where('"FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'');
res.then(a => console.log(a)).catch(errr => console.log(errr))
console.log(res);
*/
/*
const tnl = tunnel.default(sshConfig, async (err: any, server: any) => {
	if (err) {
		throw err;
	}
	console.log(server);

	const pool = new Pool({
			host: DB_HOST,
			port: DB_PORT,
			database: DB_NAME,
			user: DB_USER,
			password: DB_PASSWORD,
		})

		pool.query(
						'SELECT * FROM public."Measurements" where "FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'',
						(errQuery: Error, resQuery: QueryResult<any>) => {
							console.log("pool query error: ", errQuery);
							console.log("res query: ", resQuery);
							pool.end();
					})
	/*const database = knex({
		client: 'postgres',
		connection: {
		  host : DB_HOST,
		  user : DB_USER,
		  password : DB_PASSWORD,
		  database : DB_NAME
		}
	  });

	console.log(database);

	// need to use await database.select... but throws EHOSTUNREACH
	// 'SELECT * FROM public."Measurements" where "FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'',
	const res = database.select('*').from('public."Measurements"').where('"FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'');
	res.then(a => console.log(a)).catch(errr => console.log(errr))
	console.log(res);


	tnl.close();
});
*/



/*
ssh.on('ready', () =>  {
	console.log("ready");
	ssh.forwardOut(SSH_HOSTNAME, SSH_PORT, DB_HOST, DB_PORT, async (err, stream) => {
		stream.on('close', () => {
			console.log('TCP :: CLOSED');
			ssh.end();
		})
		// const pool = new Pool({
		// 	host: dbHost,
		// 	port: 5432,
		// 	database: dbName,
		// 	user: dbUser,
		// 	password: dbPwd,
		// })


		// for (let nRetry = 1; ; nRetry++) {
		// 	try {
		// 		const client = await pool.connect();
		// 		if (nRetry > 1) {
		// 			console.info('Now successfully connected to Postgres');
		// 		}
		// 		return client;
		// 	} catch (e) {
		// 		if (e.toString().includes('ECONNREFUSED') && nRetry < 5) {
		// 			console.info('ECONNREFUSED connecting to Postgres, ' +
		// 				'maybe container is not ready yet, will retry ' + nRetry);
		// 			// Wait 1 second
		// 			await new Promise(resolve => setTimeout(resolve, 1000));
		// 		} else {
		// 			throw e;
		// 		}
		// 	}
		// }

		// pool.connect( (errConn: Error, client: PoolClient, done: (release?: any) => void) =>  {
		// 	if (errConn) {console.log("pool connect error: ", errConn)}
		// 	else {
		// 		console.log('connectedd...');
		// 		console.log(client);
		// 		console.log(done);
		// 		pool.query(
		// 			'SELECT * FROM public."Measurements" where "FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'',
		// 			(errQuery: Error, resQuery: QueryResult<any>) => {
		// 				console.log("pool query error: ", errQuery);
		// 				console.log("res query: ", resQuery);
		// 				pool.end();
		// 		})

		// 	}
		// });


		client.connect(errr => {
			if (errr) {
			  console.error('connection error',errr, errr.stack)
			} else {
			  console.log('connected')
			}})
        // pool.connect( (errCon, c: PoolClient, done: (release?: any) => void) => {
        //     if (errCon) {console.log(errCon)}
        //     else {console.log('connected...', c)}
        // });
        // client.end();
    })
})
.connect({
    host: SSH_HOSTNAME,
    port: SSH_PORT,
    username: SSH_USERNAME,
    password: SSH_PASSWORD
});
*/