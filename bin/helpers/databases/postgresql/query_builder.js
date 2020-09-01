const Postgres = require('./db');
const config = require('../../../infra/configs/global_config');
const wrapper = require('../../../helpers/utils/wrapper');


/**
 * @tableName nama tabel STRING,
 * @field field yang ingin ditampilkan ARRAY,
 * @where filterisasi yang ingin dilakukan OBJECT,
 * @offset nilai urutan awal yang ingin ditampilkan INTEGER,
 * @limit nilai urutan akhir yang ingin ditampilkan INTEGER,
 * @order field yang dijadikan acuan sebagai urutan OBJECT,
 * @groupBy field yang dijadikan acuan untuk mengelompokan data ARRAY
 *
 * Examples1 : const tes = await queryBuilder.selectDatas('tes',['field1','field2'],{field1:1},0,5,{field2:'DESC'},['field1']);
 * */
const selectCountDatas = async(tableName, where=null, offset='', limit='', order=null, groupBy='')=>{
  const postgre = new Postgres(config.get('/postgreConfig'));
  let arr=[], arrd = [], sql = '', wherejoin = '', orderjoin='';
  sql = `SELECT COUNT(*) AS "counter" FROM ${tableName}`;

  if(where!==null && where.constructor === Object){
    arr = Object.keys(where).map(i=> `"${i}"='${where[i]}'`);
    wherejoin = arr.join(' AND ');
    sql += ` WHERE ${wherejoin}`;
  }
  if(where.constructor === String){
    sql += ` WHERE ${where}`;
  }
  if(groupBy !== ''){
    sql += ` GROUP BY ${groupBy}`;
  }
  if(order !== null){
    arrd = Object.keys(order).map(i=> `"${i}" ${order[i]}`);
    orderjoin = arrd.join(', ');
    sql += ` ORDER BY ${orderjoin}`;
  }
  if(offset !== ''){
    sql += ` OFFSET ${offset}`;
  }
  if(limit !== ''){
    sql += ` LIMIT ${limit}`;
  }

  const result = await postgre.query(sql);
  return result;
};

const selectDatas = async (tableName, field, where = {}, offset = '', limit = '', order = null, groupBy = '') => {
  try {
    const postgre = new Postgres(config.get('/postgreConfig'));
    let fields = [], arr = [], arrd = [], sql = '', wherejoin = '', orderjoin = '';
    if (field === '*') {
      sql = `SELECT * FROM ${tableName}`;
    } else {
      fields = field.map(i => {
        if (i === 'COUNT(*)') {
          return `${i}`;
        }
        return `"${i}"`;
      });
      sql = `SELECT ${fields} FROM ${tableName}`;
    }
    if (Object.entries(where).length !== 0 && where.constructor === Object) {
      arr = Object.keys(where).map(i => `"${i}"='${where[i]}'`);
      wherejoin = arr.join(' AND ');
      sql += ` WHERE ${wherejoin}`;
    }
    if (where.constructor === String) {
      sql += ` WHERE ${where}`;
    }
    if (groupBy !== '') {
      sql += ` GROUP BY ${groupBy}`;
    }
    if (order !== null) {
      arrd = Object.keys(order).map(i => `"${i}" ${order[i]}`);
      orderjoin = arrd.join(', ');
      sql += ` ORDER BY ${orderjoin}`;
    }
    if (offset !== '') {
      sql += ` OFFSET ${offset}`;
    }
    if (limit !== '') {
      sql += ` LIMIT ${limit}`;
    }

    const result = await postgre.query(sql);
    return result;
  } catch (e) {
    return null;
  }
};


/**
 * @tableName nama tabel STRING,
 * @field field yang ingin ditampilkan ARRAY,
 * @model kumpulan model data yang ingin di relasikan ARRAY,
 * @where filterisasi yang ingin dilakukan OBJECT,
 * @offset nilai urutan awal yang ingin ditampilkan INTEGER,
 * @limit nilai urutan akhir yang ingin ditampilkan INTEGER,
 * @order field yang dijadikan acuan sebagai urutan OBJECT,
 * @groupBy field yang dijadikan acuan untuk mengelompokan data ARRAY
 *
 * Examples1 : const tes = await queryBuilder.selectDatasJoin(
 * 'tes',['field1','field2'],[{
      table:'a',
      field : ['f1','f2','f3'],
      join : 'LEFT',
      on : 'a.f1 = i.g1',
      relation : '1-*',
      alias : 'aas'
    },
 {
      table:'b',
      field : ['h1','h2'],
      join : 'LEFT',
      on : 'b.h1 = a.f1',
      relation:'*-1'
      alias : 'bs'
    }],{field1:1},0,5,{field2:'DESC'},['field1']);
 * */
const selectDatasJoin = async(tableName, field, model, where={}, groupBy=false, offset='', limit='', order=null)=>{
  try{
    const postgre = new Postgres(config.get('/postgreConfig'));
    let fields = [], arr=[], arrd = [], sql = '', wherejoin = '', orderjoin='';
    let tables = [], join=[];
    let groups = [];
    fields = field.map(i=>`${tableName}."${i}"`);
    groups = field.map(i=>`${tableName}."${i}"`);
    sql = 'SELECT json_agg(t.*) FROM (';
    model.map(i=>{
      i.field.map(j=>{
        tables.push(`'${j}', ${i.table}."${j}"`);
      });
      if(i.relation === '1-1' || i.relation === '*-1'){
        fields.push(` json_build_object(${tables.join(', ')}) AS ${i.alias}`);
        tables = [];
      }
      if(i.relation === '1-*' || i.relation === '*-*'){
        fields.push(` json_agg(json_build_object(${tables.join(', ')})) AS ${i.alias}`);
        tables = [];
      }
      join.push(` ${i.join} JOIN ${i.table} ON ${i.on} `);
    });
    sql += ` SELECT ${fields.join(', ')}`;
    sql += ` FROM ${tableName}`;
    sql += join.join('');

    if(Object.entries(where).length !== 0 && where.constructor === Object){
      arr = Object.keys(where).map(i=> `"${i}"='${where[i]}'`);
      wherejoin = arr.join(' AND ');
      sql += ` WHERE ${wherejoin}`;
    }
    if(where.constructor === String){
      sql += ` WHERE ${where}`;
    }
    if(groupBy){
      sql += ` GROUP BY ${groups}`;
    }
    if(order !== null){
      arrd = Object.keys(order).map(i=> {
        groups.push(`"${i}"`);
        return `"${i}" ${order[i]}`;
      });
      orderjoin = arrd.join(', ');
      sql += ` ORDER BY ${orderjoin}`;
    }
    if(offset !== ''){
      sql += ` OFFSET ${offset}`;
    }
    if(limit !== ''){
      sql += ` LIMIT ${limit}`;
    }

    sql += ') t';

    const result = await postgre.query(sql);
    return result;
  }catch (e) {
    return null;
  }
};

/**
 * @tableName nama tabel STRING,
 * @field field yang ingin ditampilkan ARRAY,
 * @returning field yang dijadikan acuan ketika mengembalikan data ARRAY
 *
 * Examples1 : const tes = await queryBuilder.insertData('tes',['field1','field2','field3'],['field1']);
 * */
const insertData = async(tableName, field=null, returning=[])=>{
  try{
    const postgre = new Postgres(config.get('/postgreConfig'));
    let fields = [], values=[], sql = '', arrjoin = '';
    sql = `INSERT INTO ${tableName} `;

    if(field!==null){
      Object.keys(field).map(i=>{
        fields.push(`"${i}"`);
        values.push(`'${field[i]}'`);
        arrjoin =`(${fields}) VALUES (${values})`;
      });
      sql += arrjoin;
    }
    if(returning.length !== 0){
      returning = returning.map(i=>`"${i}"`);
      sql += ` RETURNING ${returning}`;
    }
    const result = await postgre.command(sql);
    if(result.err) {
      return wrapper.error('fail', 'fail insert data',result.code);
    }
    return wrapper.data(result.data.data.rows, 'success insert data',200);
  }catch (e) {
    return null;
  }
};

/**
 * @tableName nama tabel STRING,
 * @field field yang ingin dirubah beserta isinya OBJECT,
 * @where filterisasi yang ingin dilakukan OBJECT,
 * @returning field yang dijadikan acuan ketika mengembalikan data ARRAY
 *
 * Examples1 : const tes = await queryBuilder.updateData('tes',{field2:'hello',field3:'08080808'},{field1:1},['field1','field2','field3']);
 * */

const updateData = async(tableName, field=null, where={}, returning=[])=>{
  try{
    const postgre = new Postgres(config.get('/postgreConfig'));
    let fields = [], values=[], sql = '', arr=[], wherejoin = '', arrjoin = '';
    sql = `UPDATE ${tableName} SET `;

    if (field !== null) {
      Object.keys(field).map(i => {
        fields.push(`"${i}"`);
        if (Array.isArray(field[i])) { //update type array or not
          values.push(`ARRAY [${field[i]}]`);
        } else {
          field[i] == 'null' ? values.push('NULL') : values.push(`'${field[i]}'`); //update type null or not
        }
        Object.keys(field).length != 1 ? arrjoin = `(${fields}) = (${values})` : arrjoin = `${fields} = ${values}`; //update single or multi column
      });
      sql += arrjoin;
    }
    if(Object.entries(where).length !== 0 && where.constructor === Object){
      arr = Object.keys(where).map(i=> `"${i}"='${where[i]}'`);
      wherejoin = arr.join(' AND ');
      sql += ` WHERE ${wherejoin}`;
    }
    if(where.constructor === String){
      sql += ` WHERE ${where}`;
    }
    if(returning.length !== 0){
      returning = returning.map(i=>`"${i}"`);
      sql += ` RETURNING ${returning}`;
    }
    const result = await postgre.command(sql);
    if(result.err) {
      return wrapper.error('fail', 'fail update data',result.code);
    }
    return wrapper.data(result.data.rows, 'success update data',200);
  }catch (e) {
    return null;
  }
};

const deleteData = async(tableName, where={}, returning=[])=>{
  try{
    const postgre = new Postgres(config.get('/postgreConfig'));
    let sql = '', arr=[], wherejoin = '';
    sql = `DELETE FROM ${tableName} `;

    if(Object.entries(where).length !== 0 && where.constructor === Object){
      arr = Object.keys(where).map(i=> `"${i}"='${where[i]}'`);
      wherejoin = arr.join(' AND ');
      sql += ` WHERE ${wherejoin}`;
    }
    if(where.constructor === String){
      sql += ` WHERE ${where}`;
    }
    if(returning.length !== 0){
      returning = returning.map(i=>`"${i}"`);
      sql += ` RETURNING ${returning}`;
    }
    const result = await postgre.command(sql);
    if(result.err) {
      return wrapper.error('fail', 'fail delete data',result.code);
    }
    return wrapper.data(result.data.rows, 'success delete data',200);
  }catch (e) {
    return null;
  }
};

module.exports = {
  selectDatas,
  selectCountDatas,
  selectDatasJoin,
  insertData,
  updateData,
  deleteData,
};
