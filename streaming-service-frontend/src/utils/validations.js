import { ObjectId } from "mongodb";

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `You must provide an id for ${varName}`;
    if (typeof id !== "string") throw `${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `invalid object ID for ${varName} field`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw ` ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
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
