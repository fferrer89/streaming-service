import { ObjectId } from "mongodb";

const exportedMethods = {
  checkId(id, varName) {
    id = this.checkString(id, varName);
    if (!ObjectId.isValid(id)) {
      throw new TypeError(`${varName} must be a valid bson ObjectId`);
    }
    return id;
  },
  checkString(varVal, varName) {
    if (varVal === undefined) {
      throw new TypeError(`${varName} must be provided`);
    }
    if (typeof varVal !== 'string') {
      throw new TypeError(`${varName} must be a string`);
    }
    if (varVal.trim() === '') {
      throw new RangeError(`${varName} can not be an empty string`);
    }
    if (!isNaN(varVal))
      throw new RangeError(`${varVal} is not a valid value for ${varName} as it only contains digits`);
    return varVal.trim();
  },
  checkNumber(varVal, varName, canBeNegative = false) {
    if (varVal === undefined) {
      throw new TypeError(`${varName} must be provided`);
    }
    if (typeof varVal !== "number" || isNaN(varVal) || !isFinite(varVal)) {
      throw new TypeError(`${varName} must be a number`);
    }
    if (varVal < 0 && !canBeNegative) {
      throw new RangeError(`${varName} cannot be a negative number`);
    }
    return varVal;
  },
  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;

    if (arr.length <= 0)
      throw `You must select at least one value for ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }
    return arr;
  },
  checkBoolean(varVal, varName) {
    if (varVal === undefined) {
      throw new TypeError(`${varName} must be provided`);
    }
    if (typeof varVal !== 'boolean') {
      throw new TypeError(`${varName} must be a boolean (true or false)`);
    }
    return varVal;
  },
  /**
   * Takes {@link arrayVal} and validates that it is a valid array and that all its elements have the correct data type.
   *
   * This validation function can only take an array whose elements are of the same primitive data type (boolean, number,
   * string, bsonObjectId).The original array can contain one or more elements whose data type is an Array, but the
   * inner array data type elements must be the same data type as the outer array elements.
   *
   * Correct examples of {@link arrayVal}:
   * - ['John', 'Mary', 'Lui', ['Frank', 'Jonas']];
   * - [true, false, false]
   * - [11.1, [9, 99.1, 3], 7]
   * - []
   *
   * @param {string} arrayName the array variable name
   * @param {*[]} arrayVal the array to be validated whose elements have the same data type
   * @param {string} elementsType  the data type of the array elements, which must be unique for all the elements
   * @return {*[]} the original array whose elements have been trimmed and checked for validity
   */
  checkArray(arrayVal, arrayName, elementsType) {
    if (arrayVal === undefined) {
      throw new TypeError(`${arrayName} must be provided`);
    }
    if (!(arrayVal instanceof Array)) {
      throw new TypeError(`${arrayName} must be an array`);
    }
    let array = []; // Copy of the original array with its elements trimmed and checked for validity
    const ERROR_MESSAGE_TYPE = `All elements in ${arrayName}`
    arrayVal.forEach((element) => {
      if (element instanceof Array) {
        array.push(this.checkArray(element, arrayName.concat('-inner'), elementsType));
      } else if (elementsType === 'boolean') {
        array.push(this.checkBoolean(element, ERROR_MESSAGE_TYPE));
      } else if (elementsType === 'number') {
        array.push(this.checkNumber(element, ERROR_MESSAGE_TYPE));
      } else if (elementsType === 'string') {
        array.push(this.checkString(element, ERROR_MESSAGE_TYPE));
      } else if (elementsType === 'bsonObjectId') {
        array.push(this.checkId(element, ERROR_MESSAGE_TYPE));
      } else {
        throw new Error(`${elementsType} is an unrecognized data type. Available data types are boolean, number, string, array, and object`);
      }
    })
    return array;
  },

  checkIdArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = this.checkId(arr[i], varName);
    }
    return arr;
  },
  // Date Validations
  /**
   * Takes a string representation of a date and time and returns the date's timestamp, which is the number of
   * milliseconds since the midnight at the beginning of January 1, 1970, UTC (the epoch). The string representation of
   * the date must be in the following format "YYYY-MM-DDTHH:mm:ss.sssZ", otherwise, an error will be returned.
   *
   * Valid formats:
   * "2023-01-02T07:08" -> Jan 2nd at 07:08 AM
   * "2023-12-06T23:34" -> Dec 6th at 11:34 PM
   *
   * @param {string} datetime the string representation of a datetime
   * @param {string} datetimeVarName the name of the variable holding the string data
   * @param {boolean} allowsPast a boolean indicating whether the date provided can be a date in the past
   * @return {number} the string representation of the date provided converted to timestamp
   * @throws RangeError when the date format provided is not correct or the date cannot be converted to timestamp
   */
  dateTimeString(datetime, datetimeVarName, allowsPast = false) {
    datetime = this.checkString(datetime, datetimeVarName);
    const datetimeTimestamp = Date.parse(datetime);
    if (isNaN(datetimeTimestamp) || datetimeTimestamp < 0) {
      throw new RangeError(
        `${datetimeVarName} is not in the correct format. The date must be in military time and its format must be as follows "YYYY-MM-DDTHH:mm"`
      );
    }
    if (!allowsPast) {
      // validate that the date is not a time in the past
      if (datetimeTimestamp < Date.now()) {
        throw new RangeError(`${datetimeVarName} cannot be a date in the past`);
      }
    }
    return datetimeTimestamp;
  },
  isoToUsDateFormat(isoDate, varName) {
    // 2024-04-17 -> M/D/YYYY
    isoDate = this.checkString(isoDate, varName);
    const dateParts = isoDate.split("-"); // Split into [YYYY, MM, DD]
    if (dateParts.length !== 3) {
      throw new RangeError(
        `${varName} must be a in ISO format (e.g.: 2024-04-17`
      );
    }
    return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`; // "MM/DD/YYYY"
  },
  usToIsoDateFormat(usDate, varName) {
    // 04/17/2024 -> 2024-04-17 -> M/D/YYYY
    usDate = this.checkString(usDate, varName);
    const dateParts = usDate.split("/"); // Split into [MM, DD, YYYY]
    if (dateParts.length !== 3) {
      throw new RangeError(
        `${varName} must be a in US format (e.g.: 04/17/2024`
      );
    }
    return `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`; // "YYYY-MM-DD"
  },

  checkIDArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr) || arr.length <= 0)
      throw `You must select ${varName}`;
    for (let i in arr) {
      if (!ObjectId.isValid(arr[i].trim()))
        throw `invalid object ID in ${varName} array`;
      arr[i] = arr[i].trim();
    }

    return arr;
  },
  checkDate(dateString, varName) {
    if (!dateString) throw `You must provide a ${varName}`;

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw `Invalid date format for ${varName}`;
    }

    return date;
  },
};

export default exportedMethods;
