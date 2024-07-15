const urlApi = 'http://localhost:3000';// se debe correr el proyecto de backend en local para que esta url funcione
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const getTransactions = async () => {
  const response = await fetch(`${urlApi}/transactions`, {
      method: 'GET',
      headers: headers,
    },
  )
  return response.json();
}

const addTransaction = async (data) => {
  const response = await fetch(`${urlApi}/transactions`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    },
  )
  return response.json();
}

const updateTransaction = async (data, id) => {
  const response = await fetch(`${urlApi}/transactions/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
    },
  )
  return response.json();
}

const deleteTransaction = async (id) => {
  const response = await fetch(`${urlApi}/transactions/${id}`, {
      method: 'DELETE',
      headers: headers
    },
  )
  return response.json();
}

const getCategories = async () => {
  const response = await fetch(`${urlApi}/categories`, {
      method: 'GET',
      headers: headers
    },
  )
  return response.json();
}

const getByCategory = async (category) => {
  const response = await fetch(`${urlApi}/transactions/by-category?category=${category}`, {
      method: 'GET',
      headers: headers
    },
  )
  return response.json();
}

const getByDate = async (startDate, endDate) => {
  const response = await fetch(`${urlApi}/transactions/by-date?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: headers
    },
  )
  return response.json();
}

export {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  getCategories,
  getByCategory,
  getByDate
}