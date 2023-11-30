const { Joi, Segments } = require("celebrate");

const signUpDto = {
  [Segments.BODY]: Joi.object().keys({
    usr_name: Joi.string().alphanum().min(6).max(30).required(),
    password: Joi.string().required().min(6),
  }),
};

const loginDto = {
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().alphanum().min(2).max(30).required(),
    pwd: Joi.string().required().min(8),
  }),
};

const changePwd = {
  [Segments.BODY]: Joi.object().keys({
    pwd: Joi.string().required().min(8),
  }),
};

export { changePwd, loginDto, signUpDto };
