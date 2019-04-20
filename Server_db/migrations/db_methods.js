/* eslint-disable linebreak-style */
import pool from '../config/config';
import Util from '../helper/Utilities';


class DbMethods {
  /**
  * @static
  * @description Creates a query that inserts an object into a table
  * @param {string} table - table to be inserted
  * @param {object} object - objects to insert
  * @param {string} returing - Clause to return a value, Optional
  * @memberof Utilities
  */

  static async insertToDb(table, object, returning = '') {
    const insert = Util.insertQuery(table, object, returning);
    const data = await pool.query(insert);
    if (returning !== '') { return data.rows[0]; }
    return data;
  }

  /**
  * @static
  * @description Create a query to read the database
  * @param {string} table - table to be inserted
  * @param {object} specifier - what to be selected
  * @param {string} object - value to be read
  * @memberof Database Controllers
  */

  static async readFromDb(table, specifier, object) {
    const read = `SELECT ${specifier} from ${table} WHERE ${Object.keys(object)} = '${Object.values(object)}'`;
    const data = await pool.query(read);
    return data.rows;
  }

  /**
  * @static
  * @description Create a query to get last member
  * @param {string} table - table to be inserted
  * @param {object} specifier - what to be selected
  * @param {string} order - By what value to be quaried
  * @memberof Database Controllers
  */

  static async getLastDbMember(table, specifier, order) {
    const read = `SELECT ${specifier} from ${table} ORDER BY ${order} DESC LIMIT 1`;
    const data = await pool.query(read);
    return data.rows[0];
  }

  /**
  * @static
  * @description Create a query to get last member
  * @param {string} table - table to be inserted
  * @param {object} specifier - what to be selected
  * @param {string} value - By what value to be quaried
  * @memberof Database Controllers
  */

  static async updateDbRow(table, specifier, value) {
    const update = `UPDATE ${table} set ${Object.keys(specifier)} = '${Object.values(specifier)}'
                    where ${Object.keys(value)} = '${Object.values(value)}'`;

    const data = await pool.query(update);
    return data.rows[0];
  }

  /**
  * @static
  * @description Create a query to delete a row
  * @param {string} table - table to be inserted
  * @param {object} specifier - what to be selected
  * @param {string} order - By what value to be quaried
  * @memberof Database Controllers
  */

  static async deleteDbRow(table, specifier) {
    const deleteRow = `DELETE from ${table} WHERE ${Object.keys(specifier)} = '${Object.values(specifier)}'`;

    const data = await pool.query(deleteRow);
    return data.rows[0];
  }
}

export default DbMethods;
