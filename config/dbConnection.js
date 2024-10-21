const oracledb = require("oracledb");
// oracledb.initOracleClient({ libDir: "C:\\instantclient_21_11" });
//oracledb.initOracleClient({ libDir: "D:\\instantclient" });

oracledb.initOracleClient({ libDir: "E:\\instantclient_21_10" });

const connectDb_dev = async () => {
  const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTSTRING,
  };

  try {
    const connection = await oracledb.getConnection(dbConfig);

    return connection;
  } catch (err) {
    console.log(err);
  }
};


// const connectDb_iics = async () => {
//   const dbConfig = {
//     user: process.env.DB_IICS,
//     password: process.env.DB_PASSWORD,
//     connectString: process.env.DB_CONNECTSTRING,
//   };

//   try {
//     const connection = await oracledb.getConnection(dbConfig);

//     return connection;
//   } catch (err) {
//     console.log(err);
//   }
// };


module.exports = { connectDb_dev };
