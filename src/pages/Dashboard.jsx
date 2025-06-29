import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [expenses, setExpenses] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:8080/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setExpenses(res.data)
      } catch (err) {
        console.error('Failed to fetch expenses', err)
      }
    }

    fetchExpenses()
  }, [])

  const handleAddExpense = async (e) => {
    e.preventDefault()

    if (!title || !amount || !category || !date) {
      alert('All fields are required.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const newExpense = { title, amount, category, date }

      const res = await axios.post('http://localhost:8080/api/expenses', newExpense, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setExpenses([...expenses, res.data])
      setTitle('')
      setAmount('')
      setCategory('')
      setDate('')
    } catch (err) {
      console.error('Failed to add expense', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8080/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setExpenses(expenses.filter((e) => e.id !== id))
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  const handleUpdate = async (expense) => {
    const newTitle = prompt('Update Title:', expense.title)
    const newAmount = prompt('Update Amount:', expense.amount)
    const newCategory = prompt('Update Category:', expense.category)
    const newDate = prompt('Update Date (YYYY-MM-DD):', expense.date)

    if (!newTitle || !newAmount || !newCategory || !newDate) return alert('All fields are required.')

    try {
      const token = localStorage.getItem('token')

      const updatedExpense = {
        title: newTitle,
        amount: newAmount,
        category: newCategory,
        date: newDate
      }

      await axios.put(`http://localhost:8080/api/expenses/${expense.id}`, updatedExpense, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setExpenses(expenses.map(e => e.id === expense.id ? { ...expense, ...updatedExpense } : e))
    } catch (err) {
      console.error('Update failed', err)
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Expense Dashboard</h2>

      <form onSubmit={handleAddExpense} className="mb-4 border p-3 rounded shadow-sm">
        <div className="row g-2">
          <div className="col-md">
            <input
              type="text"
              placeholder="Title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-md">
            <input
              type="number"
              placeholder="Amount (Rs)"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="col-md">
            <input
              type="text"
              placeholder="Category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="col-md">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="col-md-auto">
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </div>
        </div>
      </form>

      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Amount (Rs)</th>
                <th>Date</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.title}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.date}</td>
                  <td>{expense.category}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleUpdate(expense)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dashboard
