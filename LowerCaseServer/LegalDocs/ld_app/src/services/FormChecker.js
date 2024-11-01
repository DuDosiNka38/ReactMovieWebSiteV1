import notify from "./notification";

export const isHasEmptyFields = (data) => {
  let errorStack = [];
  const checkers = ["", null, undefined];

  for (let key in data) {
    if (checkers.includes(data[key]) || data[key].length === 0) {
      errorStack.push(key);
    }
  }

  const fieldsLabels = errorStack
    .map((field, i) => {
      const element = document.querySelector(`#${field}`);

      if (element) {
        if (element.attributes.hasOwnProperty("required")) {
          const label = document.querySelector(`label[for='${field}']`);
          if(i === 0) element.focus();
          if (label) {
            return label.innerHTML;
          } else {
            return field;
          }
        } else {
          errorStack = errorStack.filter((x) => x !== field);
          return null;
        }
      } else {
        return null;
      }
    })
    .filter((x) => x !== null);

  console.log({fieldsLabels, errorStack})

  if (fieldsLabels.length) {
    notify.isError(`The form contains empty fields: ${fieldsLabels.join(", ")}. You need to fill them!`);
  }

  return Boolean(fieldsLabels.length + errorStack.length);
};

export const checkAvailability = async (name, val, fn, cb) => {
  const checkResult = await fn(val);

  const element = document.querySelector(`#${name}`);

  if(element){
    element.classList.remove('available', 'not-available');

    if(typeof cb === "function")
      cb(checkResult);

    if(checkResult){
      element.classList.add('not-available');
    } else {
      element.classList.add('available');
    }
  }  

  return !checkResult;  
}

export const 

isHasNotAvailable = () => {
  if(document.querySelector(`.not-available`)){
    notify.isError(`The form contains values that are not unique! You need change them to another!`);
    const notAvailable = document.querySelector(`.not-available`);
    notAvailable.focus();
    return true;
  }

  return false;
}

