
const wrapper = require('../../../helpers/utils/wrapper');
const commandHandler = require('../repositories/commands/command_handler');
const commandModel = require('../repositories/commands/command_model');
const queryHandler = require('../repositories/queries/query_handler');
const validator = require('../utils/validator');
const { ERROR:httpError, SUCCESS:http } = require('../../../helpers/http-status/status_code');


const getArticleById = async (req, res) => {
  const articleId = req.params.id;
  const getData = async () => queryHandler.getArticleById(articleId);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Fail Get Article By Id', httpError.NOT_FOUND)
      : wrapper.response(res, 'success', result, 'Success Get Article By Id', http.OK);
  };
  sendResponse(await getData());
};

const createArticle = async (req, res) => {
  const payload = req.body;
  const responseValidation = validator.createArticle(payload);
  if (responseValidation.message.requiredField.length > 0) {
    const result = wrapper.error(responseValidation);
    return wrapper.response(res, 'fail', result, httpError.CONFLICT);
  }
  const validatePayload = validator.isValidPayload(payload, commandModel.createArticle);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.createArticle(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Fail Create Articles', httpError.CONFLICT)
      : wrapper.response(res, 'success', result, 'Success Create Articles', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const editArticle = async (req, res) => {
  const payload = {
    ...req.body,
    id: req.params.id
  };
  const responseValidation = validator.editArticle(payload);
  if (responseValidation.message.requiredField.length > 0) {
    const result = wrapper.error(responseValidation);
    return wrapper.response(res, 'fail', result, httpError.CONFLICT);
  }
  const validatePayload = validator.isValidPayload(payload, commandModel.editArticle);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.editArticle(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Fail Edit Articles', httpError.CONFLICT)
      : wrapper.response(res, 'success', result, 'Success Edit Articles', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const deleteArticle = async (req, res) => {
  const payload = {
    articleId : req.params.id
  };
  const getData = async () => commandHandler.deleteArticle(payload);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Fail Delete Article By Id', httpError.NOT_FOUND)
      : wrapper.response(res, 'success', result, 'Success Delete Article By Id', http.OK);
  };
  sendResponse(await getData());
};

module.exports = {
  getArticleById,
  createArticle,
  editArticle,
  deleteArticle
};
