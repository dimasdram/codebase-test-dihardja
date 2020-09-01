/**
 * Get Date Time
 */
const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
const dateTime = date+' '+time;

/**
 * Table Name
 */
const tblUsers = 'users';
const fieldTblUsers = ['id','name','email','role','password'];

const tblArticle = 'articles';
const fieldTblArticles = ['id','article_name','creator'];

module.exports = {
  dateTime,
  tblUsers,
  fieldTblUsers,
  tblArticle,
  fieldTblArticles
};
