export const createTaskObject = (id, title, status) => {
  return {
    id,
    title,
    status,
  };
};

export const saveToLocalStorage = (key, data) => {
  try {
    if (!key || !data) {
      throw new Error("No key or data provided");
    }

    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
};

export const getDataFromLocalStorage = (key) => {
  try {
    if (!key) {
      throw new Error("No key provided");
    }
    const data = localStorage.getItem(key);
    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);
    if (parsedData.length === 0) {
      return [];
    }
    return parsedData;
  } catch (error) {
    console.error(error.message);
  }
};

export const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
    return undefined;
  }
};
