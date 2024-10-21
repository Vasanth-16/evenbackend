const connectDb = require("../config/dbConnection");

const functionSelect = async (sql, bind, db) => {
  let connection;
  console.log(sql, bind);
  try {
    console.log(sql, bind, db);
    if (db === "devuser") {
      connection = await connectDb.connectDb_dev();
    } else if (db === "hisLive") {
      connection = await connectDb.connectDb_live();
    } else {
      throw new Error("Invalid database name");
    }

    if (sql && bind) {
      const result = await connection.execute(sql, bind);
      const rows = result.rows;

      const keys = result.metaData.map((column) => column.name);
      const transformedData = rows.map((row) => {
        const obj = {};
        keys.forEach((key, index) => {
          obj[key] = row[index];
        });
        return obj;
      });

      return transformedData;
    } else {
      throw new Error("Invalid SQL or binds");
    }
  } catch (error) {
    console.error("Error in functionSelect:", error);
    throw error;
  } finally {
    // Close the connection when done
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing the database connection:", error);
      }
    }
  }
};

const functionInsert_Update = async (sql, bind, db) => {
  let connection;
  try {
    if (db === "devuser") {
      connection = await connectDb.connectDb_dev();
    } else if (db === "hisLive") {
      connection = await connectDb.connectDb_live();
    } else {
      throw new Error("Invalid database name");
    }

    if (sql && bind) {
      // console.log(sql, bind);
      const result = await connection.execute(sql, bind, {
        autoCommit: true,
      });
      if (result.rowsAffected > 0) {
        return {
          status: true,
          msg: "One row inserted/updated",
          "Record inserted/updated": result.rowsAffected,
        };
      } else {
        return {
          status: false,
          msg: "No row inserted/updated enter proper details",
          "Record inserted/updated": result.rowsAffected,
        };
      }
    } else {
      return {
        status: false,
        msg: "Invalid SQL or binds",
      };
    }
  } catch (error) {
    console.error("Error in functionInsert_Update:", error);
    throw error;
  } finally {
    // Close the connection when done
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing the database connection:", error);
      }
    }
  }
};

const functionInsert_Update_Multiple = async (sql, binds, db) => {
  let connection;
  let result;

  if (db) {
    try {
      if (db === "devuser") {
        connection = await connectDb.connectDb_dev();
      } else if (db === "hisLive") {
        connection = await connectDb.connectDb_live();
      }

      if (sql && binds && binds.length > 0) {
        console.log(sql, binds);
        try {
          result = await connection.executeMany(sql, binds, {
            autoCommit: true,
          });

          return {
            status: true,
            msg: "Rows inserted/updated",
            "Records inserted/updated:": result.rowsAffected,
          };
        } catch (error) {
          throw error;
        }
      } else {
        return {
          status: false,
          msg: "Invalid SQL or binds",
        };
      }
    } catch (error) {
      throw error;
    } finally {
      // Close the connection when done
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error("Error closing the database connection:", error);
        }
      }
    }
  } else {
    return {
      status: false,
      msg: "Invalid database name",
    };
  }
};
module.exports = {
  functionSelect,
  functionInsert_Update,
  functionInsert_Update_Multiple,
};
