const DataChecker = require("../services/DataChecker");
const UserService = require("./../services/User");
const ComputerService = require("./../services/Computers");
const AuthService = require("./../services/Auth");

const Auth = {
    signin: async (req, res) => {
      const { hostId } = req;
      //Check IP
      if (!req.headers.hasOwnProperty("user_ip")) {
        res.send({
            result: false,
            data: {
                error_code: "UNDEFINED_IP",
                error_message: "Undefined IP address",
                error_data: req.headers,
            },
        });
        return false;
      }

      const user_ip = req.headers.user_ip;
      let data = req.body;

      //Check fields
      let checkData = DataChecker.checkFields(["user", "computer"], data);

      if (checkData.isError) {
        res.send({
            result: false,
            data: {
                error_code: "NOT_ALL_DATA",
                error_message: "Recieved not all data",
                error_data: checkData.errorStack,
            },
        });
        return false;
      }

      const { user, computer, checkFirstAuth } = data;

      checkData = DataChecker.checkFields(["Email_address", "Password"], user);
      if (checkData.isError) {
        res.send({
            result: false,
            data: {
                error_code: "NOT_ALL_DATA",
                error_message: "Recieved not all data",
                error_data: checkData.errorStack,
            },
        });
        return false;
      }

      //Check E-mail address
      const isEmailExists = await UserService.isEmailExists(hostId, user.Email_address);
      if (!isEmailExists) {
        res.send({
            result: false,
            data: {
                error_code: "EMAIL_IS_NOT_EXIST",
                error_message: "User with typed E-mail address does not exists",
                error_data: checkData.errorStack,
            },
        });
        return false;
      }

      //Check user hash
      const hash = UserService.generateUserHash({
          user_email: user.Email_address,
          user_password: user.Password,
      });
      const isUserHashExists = await UserService.isUserHashExists(hostId, hash);
      if (!isUserHashExists) {
        res.send({
            result: false,
            data: {
                error_code: "HASH_IS_NOT_EXIST",
                error_message: "Wrong password typed",
                error_data: checkData.errorStack,
            },
        });
        return false;            
      }

      //Successfuly checked data. Try to gen auth hash
      let response = { result: null, data: {} };
      const userData = await UserService.getUserByHash(hostId, hash);
      if(!userData.result){
          res.send(userData.data);
          return false;
      }

      try {
          //IS FIRST AUTH
          const authHistory = await AuthService.getAuthHistory(hostId, userData.data.Person_id);
          if (checkFirstAuth && authHistory.length === 0) {
            response.result = false;
            response.data.isFirstAuth = true;

            res.send(response);
            return false;
          } else {
            response.data.isFirstAuth = false;
          }

          //AUTH
          response = await AuthService.openAuth(hostId, {
              user_id: userData.data.Person_id,
              user_hash: hash,
              user_auth_hash: UserService.generateAuthHash(hash),
              user_ip: user_ip,
          });
          response.result = true;
          response.data.isApprovedComputer = true;

          //IS APPROVED COMPUTER
          // const checkComputer = await ComputerService.checkComputer(hostId, { ...computer, Person_id: userData.data.Person_id });
          // if (!checkComputer.result) {
          //     response.result = false;
          //     response.data.isApprovedComputer = checkComputer.result;
          // } else {
          //     response.data.isApprovedComputer = true;
          // }
      } catch (e) {
          response = {
              result: false,
              data: {
                  error_code: e.code,
                  error_message: e.message || e.sqlMessage,
                  error_data: user,
              },
          };
      } finally {
            
        res.send(response);
        return false;
      }
    },
};

module.exports = Auth;

// exports.signup = async (data) => {
//     //Check fields
//     {
//         const checkData = DataChecker.checkFields(
//             ['user', 'office'],
//             data
//         );

//         if(checkData.isError){
//             return {
//                 result: false,
//                 data: {
//                     error_code: "NOT_ALL_DATA",
//                     error_message: "Recieved not all data",
//                     error_data: checkData.errorStack
//                 }
//             };
//         }
//     }

//     const { user, office } = data;
//     const rollback = [];
//     const responseData = {
//         result: false,
//         user: {},
//         office: {},
//         _rollback: null
//     };

//     //Insert new user
//     {
//         try{
//             responseData.user = await User.insert(user);
//         } catch (e) {
//             responseData.user = {
//                 result: false,
//                 data: {
//                     error_code: e.code,
//                     error_message: e.message || e.sqlMessage,
//                     error_data: user
//                 }
//             }
//         } finally {
//             //Check result of insert
//             if(!responseData.user.result){
//                 responseData._rollback = await Functions.rollback(rollback);
//                 return responseData;
//             }

//             user.user_id = User.getLastInsertId();
//         }
//     }

//     //Add rollback function
//     rollback.push({
//         function: User.delete,
//         data: user
//     });

//     //Insert new office
//     {
//         try{
//             office.office_id = Office.generateOfficeID(office);
//             responseData.office = await Office.insert(office);
//         } catch (e){
//             responseData.office = {
//                 result: false,
//                 data: {
//                     error_code: e.code,
//                     error_message: e.message || e.sqlMessage,
//                     error_data: user
//                 }
//             }
//         } finally {
//             //Check result of insert
//             if(!responseData.office.result){
//                 responseData._rollback = await Functions.rollback(rollback);
//                 return responseData;
//             }
//         }
//     }

//     //Add rollback function
//     rollback.push({
//         function: Office.delete,
//         data: office
//     });

//     //Insert new office user\
//     {
//         const office_user = {
//             user_email: user.user_email,
//             office_id: office.office_id,
//             user_office_role: "OFFICE_OWNER"
//         };

//         try{
//             responseData.office_users = await OfficeUsers.insert(office_user);
//         } catch (e){
//             responseData.office_users = {
//                 result: false,
//                 data: {
//                     error_code: e.code,
//                     error_message: e.message || e.sqlMessage,
//                     error_data: user
//                 }
//             }
//         } finally {
//             //Check result of insert
//             if(!responseData.office_users.result){
//                 responseData._rollback = await Functions.rollback(rollback);
//                 return responseData;
//             }
//         }
//     }

//     //If refferrer PURCHASE
//     if(data.hasOwnProperty("purchase") && data.purchase.hasOwnProperty("plan_id") && data.purchase.plan_id !== null){
//         const { purchase } = data;
//         purchase.office_id = office.office_id;

//         try{
//             responseData.purchase = await Purchase.insert(purchase);
//         } catch (e) {
//             responseData.purchase = {
//                 result: false,
//                 data: {
//                     error_code: e.code,
//                     error_message: e.message || e.sqlMessage,
//                     error_data: purchase
//                 }
//             }
//         }
//     }

//     responseData.result = true;

//     return responseData;
// }

// exports.signin = async (req) => {
//     if(!req.headers.hasOwnProperty('user_ip'))
//         return {
//             result: false,
//             data: {
//                 error_code: "UNDEFINED_IP",
//                 error_message: "Undefined IP address",
//                 error_data: req.headers
//             }
//         };

//     const user_ip = req.headers.user_ip;
//     let data = req.body;

//     //Check fields
//     {
//         let checkData = DataChecker.checkFields(
//             ['user'],
//             data
//         );

//         if(checkData.isError){
//             return {
//                 result: false,
//                 data: {
//                     error_code: "NOT_ALL_DATA",
//                     error_message: "Recieved not all data",
//                     error_data: checkData.errorStack
//                 }
//             };
//         }
//     }

//     const { user } = data;
//     checkData = DataChecker.checkFields(
//         ['user_email', 'user_password'],
//         user
//     );
//     if(checkData.isError){
//         return {
//             result: false,
//             data: {
//                 error_code: "NOT_ALL_DATA",
//                 error_message: "Recieved not all data",
//                 error_data: checkData.errorStack
//             }
//         };
//     }

//     //Check E-mail address
//     const isEmailExists = await User.isEmailExists(user.user_email);
//     if(!isEmailExists){
//         return {
//             result: false,
//             data: {
//                 error_code: "EMAIL_IS_NOT_EXIST",
//                 error_message: "User with typed E-mail address does not exists",
//                 error_data: checkData.errorStack
//             }
//         };
//     }

//     //Check user hash
//     const hash = User.generateUserHash(user);
//     const isUserHashExists = await User.isUserHashExists(hash);
//     if(!isUserHashExists){
//         return {
//             result: false,
//             data: {
//                 error_code: "HASH_IS_NOT_EXIST",
//                 error_message: "Wrong password typed",
//                 error_data: checkData.errorStack
//             }
//         };
//     }

//     const userData = await User.select({user_hash: hash});

//     //Successfuly checked data. Try to gen auth hash
//     try{
//         const authHash = User.generateAuthHash({user_hash: hash, user_ip: user_ip});
//         await dbQueries.auth.insert({user_id: userData[0].user_id, auth_hash: authHash, user_ip: user_ip});
//         return {
//             result: true,
//             data: {
//                 auth_hash: authHash
//             }
//         };
//     } catch (e){
//         return {
//             result: false,
//             data: {
//                 error_code: e.code,
//                 error_message: e.message || e.sqlMessage,
//                 error_data: user
//             }
//         };
//     }
// };

// exports.isValidSession = async (req, res, next) => {
//     let data = req.headers;
//     const fields = ['user_ip', 'auth_hash'];
//     const checkData = DataChecker.checkFields(fields, data);
//     if(checkData.isError){
//         res.send({
//             result: false,
//             data: {
//                 error_code: "NON_AUTH_REQUEST",
//                 error_message: "NON_AUTH_REQUEST",
//                 error_data: checkData.errorStack
//             }
//         });
//     } else {
//         filtered = Functions.filterObj(data, (v, i, o) => (fields.includes(i)));
//         const result = await dbQueries.auth.select(filtered);
//         result.length === 0 ? res.send({ result: false, data: { error_code: "WRONG_SESSION", error_message: "Wrong session", error_data: data}}) : next();
//     }
// }

// exports.isValidHash = async (data) => {
//     const checkData = DataChecker.checkFields(
//         ['auth_hash'],
//         data
//     );

//     if(checkData.isError){
//         return {
//             result: false,
//             data: {
//                 error_code: "NOT_ALL_DATA",
//                 error_message: "Recieved not all data",
//                 error_data: checkData.errorStack
//             }
//         };
//     }

//     const result = await dbQueries.auth.select(data);

//     return {
//         result: Boolean(result.length)
//     };
// }
