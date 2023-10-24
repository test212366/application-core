import React, { useEffect, useState } from 'react';
import { useStore } from "effector-react";
import { Controller, useForm } from "react-hook-form";
import { AiFillEdit } from 'react-icons/ai'
import {
  Button,
  Divider,
  Table,
  Modal,
  Input
} from 'antd';
import { useNavigate } from "react-router-dom";

import {
  $companiesStore,
  getCompanies,
  createOrEditCompany
} from '../../store/companies';

import st from './index.module.scss';

const Companies = () => {
  const [isModalOpen, setIsOpenModal] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [modalMode, setModalMode] = useState();
  const { control, handleSubmit, formState: { errors }, setError, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      inn: "",
      address: "",
      ogrn: "",
      phone: "",
      id: null
    }
  });

  const { list } = useStore($companiesStore);

  const onSubmit = (props) => {
    setIsOpenModal(false);
    createOrEditCompany(props)
  }

  useEffect(() => {
    getCompanies()
  }, [])

  useEffect(() => {
    if(editedItem){
      companyData.forEach(({ title, dataIndex }) => {
        setValue(dataIndex, editedItem[dataIndex], { shouldValidate: true })
      })
      setValue('id', editedItem.id, { shouldValidate: true })
    }

  }, [editedItem])

  const companyData = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      rules: { required: "Не введено название" }
    },
    {
      title: 'Инн',
      dataIndex: 'inn',
      key: 'inn',
      rules: { required: "Не указан ИНН" }
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      rules: { required: "Адрес не введен" }
    },
    {
      title: 'ОГРН',
      dataIndex: 'ogrn',
      key: 'ogrn',
      rules: { required: "Не указан ОГРН" },
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
    }
  ]

  const columns = [
    ...companyData,
    {
      title: '',
      width: 100,
      render: (row) => {
        return (
          <Button
            onClick={() => {
              setIsOpenModal(true);
              setEditedItem(row);
              setModalMode('edit');
            }}
          >
            Редактировать
          </Button>
        )
      }
    }
  ]

  return (
    <div className={st.companies}>
      <div className={st.header}>
        <div className={st.pageTitle}>Список предприятий:</div>
        <Button
          onClick={() => {
            setEditedItem(null);
            reset();
            setIsOpenModal(true);
            setModalMode('new');
          }}
        >
          Создать новое предприятие
        </Button>
      </div>
      <Divider />
      <Table
        dataSource={list}
        columns={columns}
        pagination={{
          defaultPageSize: 5
        }}
        scroll={{ x: true }}
      />
      <Modal
        title={modalMode === 'edit' ? 'Редактирование предприятия' : 'Создание нового предприятия'}
        open={isModalOpen}
        onCancel={() => setIsOpenModal(false)}
        footer={null}
      >
        <form
          className={st.modalForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          {companyData.map(({ title, dataIndex, rules }) => (
            <div className={st.modalItem}>
              <div>{title}</div>
              <Controller
                name={dataIndex}
                control={control}
                rules={rules}
                render={({ field }) =>
                  <Input
                    {...field}
                  />
                }
              />
            </div>
          ))}
          {Object.keys(errors).length > 0 && Object.keys(errors).map(item => (
            <div className={st.modalError}>{errors[item].message}</div>
          ))}
          <div className={st.modalFooter}>
            <Button
              onClick={() => setIsOpenModal(false)}
            >
              Отменить
            </Button>
            <Button
              type="primary"
              htmlType="submit"
            >
              Сохранить
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;