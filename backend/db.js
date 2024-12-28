import pkg from 'pg'
const {Client} =pkg

export async function getClient(){
  const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 3000, 
    password: "Yatish@123",
    database: "NewDB",
  });
  
  await client.connect();
  return client
}