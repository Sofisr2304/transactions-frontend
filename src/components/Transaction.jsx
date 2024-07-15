"use client";
import { Table, Button, Label, Select, Datepicker } from "flowbite-react";
import { HiOutlinePlusSm, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useEffect, useState } from "react";
import AddOrEdit from './AddOrEdit';
import { deleteTransaction, getByCategory, getByDate, getCategories, getTransactions } from "../services/transaction";
import Swal from 'sweetalert2'
import convertDate from "../utils";

const Transaction = () => {
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState('Add');
  const [from, setFrom] = useState(convertDate(new Date()));
  const [to, setTo] = useState(convertDate(new Date()));
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState({});

  useEffect( () => {
    getAllTransactions();
    getAllCategories();
  }, []);

  const closeModal = () => {
    getAllTransactions();
    setOpenModal(false);
  }

  const goToEdit = (current) => {
    setCurrentTransaction(current);
    setType('Edit');
    setOpenModal(true);
  }

  const getAllTransactions = async () => {
    const res = await getTransactions();
    setTransactions(res);
  }

  const getAllCategories = async () => {
    const res = await getCategories();
    setCategories(res);
  }

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      showAlert('success', 'Transaction deleted', '');
      getAllTransactions();
    } catch (error) {
      showAlert('error', 'Error in server');
    }
  }

  const showAlert = (type, title, txt = 'Do you want to continue') => {
    Swal.fire({
      title: title,
      text: txt,
      icon: type,
      confirmButtonText: 'Ok'
    })
  }

  const onChangeCategory = async (category) => {
    if (!category) {
      getAllTransactions();
    } else {
      const res = await getByCategory(category);
      setTransactions(res);
    }
  }

  const Search = async () => {
    const res = await getByDate(from, to);
    setTransactions(res);
  }

  const Clear = async () => {
    getAllTransactions();
    const d = convertDate(new Date());
    setFrom(d);
    setTo(d);
  }

  return (
    <div className="overflow-x-auto mt-16 h-[90vh]">
      <AddOrEdit
        typeModal={type}
        openModal={openModal}
        propCloseModal={closeModal}
        currentTransaction={currentTransaction}
      />
      
      <div className="flex justify-around mb-1">

        <div>
          <div className="mb-2 block">
            <Label htmlFor="category" value="Category" />
          </div>
          <Select
            id="category"
            onChange={(event) => onChangeCategory(event.target.value)}
            required
          >
            <option></option>
            {
              categories.map(c => (
                <option key={c}>{c}</option>
              ))
            }
          </Select>
        </div>

        <div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="from" value="From" />
          </div>
          <Datepicker
            id="from"
            onSelectedDateChanged={(event) => {setFrom(convertDate(event))}}
            value={from}
            required
          />
        </div>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="to" value="To" />
          </div>
          <Datepicker
            id="to"
            onSelectedDateChanged={(event) => {setTo(convertDate(event))}}
            value={to}
            required
          />
        </div>

        <div className="flex flex-col justify-end">
          <Button onClick={() => Search()}>Search</Button>
        </div>
        <div className="flex flex-col justify-end">
          <Button onClick={() => Clear()}>Clear</Button>
        </div>

      </div>
      <Button pill onClick={() => { setType('Add'); setOpenModal(true) }} className="absolute top-1 right-1 z-10">
        <HiOutlinePlusSm className="h-6 w-6" />
      </Button>
      <Table className="mt-4">
        <Table.Head>
          <Table.HeadCell>Type</Table.HeadCell>
          <Table.HeadCell>Amount</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {
            transactions.map(t => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={t.ID}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {t.Type}
                </Table.Cell>
                <Table.Cell>{t.Amount}</Table.Cell>
                <Table.Cell>{t.Category}</Table.Cell>
                <Table.Cell>{convertDate(new Date(t.Date))}</Table.Cell>
                <Table.Cell>{t.Description}</Table.Cell>
                <Table.Cell className="inline-flex">
                  <Button outline pill onClick={() => goToEdit(t)}>
                    <HiOutlinePencil/>
                  </Button>
                  <Button outline pill onClick={() => removeTransaction(t.ID)}>
                    <HiOutlineTrash/>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  )
}

export default Transaction;
