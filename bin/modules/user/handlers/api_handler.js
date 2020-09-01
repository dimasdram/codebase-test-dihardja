
const wrapper = require('../../../helpers/utils/wrapper');
const commandHandler = require('../repositories/commands/command_handler');
const commandModel = require('../repositories/commands/command_model');
const queryHandler = require('../repositories/queries/query_handler');
const validator = require('../utils/validator');
const { ERROR:httpError, SUCCESS:http } = require('../../../helpers/http-status/status_code');

const postDataLogin = async (req, res) => {
  const payload = req.body;
  const responseValidation = validator.login(payload);
  if (responseValidation.message.requiredField.length > 0) {
    const result = wrapper.error(responseValidation);
    return wrapper.response(res, 'fail', result, httpError.CONFLICT);
  }
  const validatePayload = validator.isValidPayload(payload, commandModel.login);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.postDataLogin(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Fail Login User')
      : wrapper.response(res, 'success', result, 'Success Login User', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  const getData = async () => queryHandler.getUserById(userId);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Fail Get User By Id', httpError.NOT_FOUND)
      : wrapper.response(res, 'success', result, 'Success Get User By Id', http.OK);
  };
  sendResponse(await getData());
};

const registerUser = async (req, res) => {
  const payload = req.body;
  const responseValidation = validator.register(payload);
  if (responseValidation.message.requiredField.length > 0) {
    const result = wrapper.error(responseValidation);
    return wrapper.response(res, 'fail', result, httpError.CONFLICT);
  }
  const validatePayload = validator.isValidPayload(payload, commandModel.register);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.registerUser(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Fail Register User', httpError.CONFLICT)
      : wrapper.response(res, 'success', result, 'Success Register User', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};


module.exports = {
  postDataLogin,
  getUserById,
  registerUser,
};
