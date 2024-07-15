/* eslint-disable react/prop-types */
"use client";
import { Button, Select, Label, Modal, TextInput, Datepicker, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { addTransaction, updateTransaction } from "../services/transaction";
import convertDate from "../utils";
import Swal from 'sweetalert2';

const errorFormat = {
  status: false,
  message: ''
};

const initState = {
  amount: errorFormat,
  category: errorFormat,
  date: errorFormat,
}

const AddOrEdit = ({
  openModal,
  propCloseModal,
  typeModal = 'Add',
  currentTransaction,
}) => {
  const [type, setType] = useState('Income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(convertDate(new Date()));
  const [description, setDescription] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState(initState);

  useEffect( () => {
    if (currentTransaction && typeModal === 'Edit') {
      if (currentTransaction.Type) {
        setType(currentTransaction.Type);
      }
      if (currentTransaction.Amount) {
        setAmount(currentTransaction.Amount);
      }
      if (currentTransaction.Category) {
        setCategory(currentTransaction.Category);
      }
      if (currentTransaction.Date) {
        setDate(convertDate(new Date(currentTransaction.Date)));
      }
      if (currentTransaction.Description) {
        setDescription(currentTransaction.Description);
      }
    }
  }, [currentTransaction, typeModal]);

  const onCloseModal = () => {
    setType('');
    setAmount('');
    setCategory('');
    setDate('');
    setDescription('');
    propCloseModal();
  }

  const getStatusError = (field) => (
    error[field].status ? "failure" : ""
  )

  const getMessageError = (field) => (
    error[field].status && <>
      <span className="font-medium">Oops!</span> {error[field].message}
    </>
  )

  const regexAmount = /^\d+(\.\d+)?$/;
  // Función para validar el amount
  const validateAmount = (amount) => ( regexAmount.test(amount) )

  const handleClick = async () => {
    const data = {
      Type: type,
      Amount: amount,
      Category: category,
      Date: date,
      Description: description,
    }
    if (!amount) {
      setError({
        ...error,
        amount: {
          status: true,
          message: 'invalid amount (this must be positive)'
        }
      })
      setIsDisabled(true)// bloquea el boton save
      return;
    }
    if (typeModal === 'Add') {
      try {
        await addTransaction(data);
        showAlert('success', 'Transaction saved', '');
      } catch (error) {
        showAlert('error', 'Error in server');
      }
    } else {
      try {
        await updateTransaction(data, currentTransaction.ID);
        showAlert('success', 'Transaction updated', '');
      } catch (error) {
        showAlert('error', 'Error in server');
      }
    }
    onCloseModal();
  }

  const showAlert= (type, title, txt = 'Do you want to continue') => {
    Swal.fire({
      title: title,
      text: txt,
      icon: type,
      confirmButtonText: 'Ok'
    })
  }

  const handleOnchange = (event, field) => {
    setError(initState);// para remover los errores en todos los campos
    setIsDisabled(false);
    if (field === 'amount') {
      setAmount(event.target.value)
      if (!validateAmount(amount)) {
        setError({
          ...error,
          amount: {
            status: true,
            message: 'invalid amount (this must be positive)'
          }
        })
        setIsDisabled(true)// bloquea el boton save
      }
    }
  }

  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{typeModal} Transaction</h3>

            {/* TYPE*/}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="type" value="Type" />
              </div>
              <Select
                id="type"
                onChange={(event) => setType(event.target.value)}
                value={type}
                required
              >
                <option>Income</option>
                <option>Expense</option>
              </Select>
            </div>

            {/* AMOUNT*/}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Amount" value="Amount" />
              </div>
              <TextInput
                id="amount"
                placeholder="10000"
                value={amount}
                onChange={(event) => handleOnchange(event, 'amount')}
                required
                type="number"
                color={getStatusError('amount')}
                helperText={getMessageError('amount')}
              />
            </div>
            
            {/* CATEGORY*/}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Category" value="Category" />
              </div>
              <TextInput
                id="category"
                placeholder="Groseries, Salary, Rent"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              />
            </div>

            {/* DATE*/}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="date" value="Date" />
              </div>
              <Datepicker
                id="date"
                onSelectedDateChanged={(event) => {setDate(convertDate(event))}}
                value={date}
                required
              />
            </div>

            {/* DESCRIPTION*/}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <Textarea
                id="description"
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
            </div>

            <div className="w-full">
              <Button
                disabled={isDisabled}
                onClick={handleClick}
              >Save</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddOrEdit;
