"use client";
import { Table, Button } from "flowbite-react";
import { HiOutlinePlusSm, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useEffect, useState } from "react";
import AddOrEdit from './AddOrEdit';
import { deleteTransaction, getTransactions } from "../services/transaction";
import Swal from 'sweetalert2'

const Transaction = () => {
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState('Add');
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState({});

  useEffect( () => {
    getAllTransactions();
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

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      showAlert('success', 'Transaction deleted', '');
      getAllTransactions();
    } catch (error) {
      showAlert('error', 'Error in server');
    }
  }

  const showAlert= (type, title, txt = 'Do you want to continue') => {
    Swal.fire({
      title: title,
      text: txt,
      icon: type,
      confirmButtonText: 'Ok'
    })
  }

  return (
    <div className="overflow-x-auto">
      <AddOrEdit
        typeModal={type}
        openModal={openModal}
        propCloseModal={closeModal}
        currentTransaction={currentTransaction}
      />
      <Button pill onClick={() => { setType('Add'); setOpenModal(true) }}>
        <HiOutlinePlusSm className="h-6 w-6" />
      </Button>
      <Table>
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
                <Table.Cell>{t.Date}</Table.Cell>
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
