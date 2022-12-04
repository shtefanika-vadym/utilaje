import React, { useEffect, useMemo } from 'react'

import { Table, Tabs } from 'antd'
import { HomeContent } from 'features/home/components/home-content/home-content'
import { useFirebaseTable } from 'common/hooks/hooks'

import styles from './home.module.scss'
import { IProduct } from 'common/interfaces/IProduct'
import { Select } from 'common/components/select/select'
import { db } from 'firebaseInit'
import { Button } from 'common/components/Button/Button'
import { ColumnsType } from 'antd/es/table'
import { nanoid } from 'nanoid'
import { useAppSelector } from 'common/hooks/redux'

export const Home = () => {
  const { user } = useAppSelector((state) => state.productsReducer)
  const ordersFirebase = useFirebaseTable('orders')

  useEffect(() => {
    ordersFirebase.createRequest()
  }, [])

  const handleUpdateOrder = (type: string, id: string) => {
    if (type === 'Șterge') db.collection('orders').doc(id).delete()
    else if (type === 'Finalizează') {
      const updated = unFinishedOrders.find((order: any) => order.id === id)
      if (updated)
        db.collection('orders')
          .doc(id)
          .update({ ...updated, finished: true })
    }
  }

  const table_unFinished_columns: ColumnsType<any> = [
    {
      title: 'Preț',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => (
        <span>
          {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Lei
        </span>
      ),
    },
    {
      title: 'Adresa',
      dataIndex: 'userDetails',
      key: 'userDetails',
      width: 250,
      render: (details: any) => <span>{details.address}</span>,
    },
    {
      title: 'Județul',
      dataIndex: 'userDetails',
      key: 'userDetails',
      width: 250,
      render: (details: any) => <span>{details.county}</span>,
    },
    {
      title: 'Localitatea',
      dataIndex: 'userDetails',
      key: 'userDetails',
      width: 250,
      render: (details: any) => <span>{details.town}</span>,
    },
    {
      title: 'Telefon',
      dataIndex: 'userDetails',
      key: 'userDetails',
      width: 200,
      render: (userDetails: any) => <div>{userDetails.phone}</div>,
    },
    {
      title: 'Produse',
      dataIndex: 'products',
      key: 'products',
      width: 400,
      render: (products: any) => (
        <div>
          {products.map((product: IProduct) => (
            <>
              <span key={nanoid()}>
                {product.total}x {product.title}
              </span>
              <br />
            </>
          ))}
        </div>
      ),
    },
    {
      title: 'Acțiune',
      dataIndex: 'id',
      key: 'id',
      width: 250,
      render: (id: string) => (
        <div className={styles.parentBtns}>
          <Select
            value={'Acțiune'}
            name={'tableAction'}
            placeholder={'Acțiune'}
            onChange={(value: string) => handleUpdateOrder(value, id)}
            listOptions={['Șterge', 'Finalizează']}
          />
        </div>
      ),
    },
  ]

  const table_completed_columns: ColumnsType<any> = [
    {
      title: 'Preț',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => (
        <span>
          {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Lei
        </span>
      ),
    },
    {
      title: 'Adresa',
      dataIndex: 'userDetails',
      key: 'userDetails',
      width: 250,
      render: (details: any) => <span>{details.address}</span>,
    },
    {
      title: 'Județul',
      dataIndex: 'userDetails',
      key: 'userDetails',
      width: 250,
      render: (details: any) => <span>{details.county}</span>,
    },
    {
      title: 'Localitatea',
      dataIndex: 'userDetails',
      key: 'userDetails',
      width: 250,
      render: (details: any) => <span>{details.town}</span>,
    },
    {
      title: 'Telefon',
      dataIndex: 'userDetails',
      key: 'userDetails',
      width: 200,
      render: (userDetails: any) => <div>{userDetails.phone}</div>,
    },
    {
      title: 'Produse',
      dataIndex: 'products',
      key: 'products',
      width: 400,
      render: (products: any) => (
        <div>
          {products.map((product: IProduct) => (
            <>
              <span key={nanoid()}>
                {product.total}x {product.title}
              </span>
              <br />
            </>
          ))}
        </div>
      ),
    },
    {
      title: 'Acțiune',
      dataIndex: 'id',
      key: 'id',
      width: 250,
      render: (id: string) => (
        <div className={styles.parentBtns}>
          <Button
            modifier={'primary'}
            onClick={() => handleUpdateOrder('Șterge', id)}>
            Șterge
          </Button>
        </div>
      ),
    },
  ]

  const unFinishedOrders = useMemo(
    () => ordersFirebase.data?.filter((order: any): boolean => !order.finished),
    [ordersFirebase.data],
  )

  const finishedOrders = useMemo(
    () => ordersFirebase.data?.filter((order: any): boolean => order.finished),
    [ordersFirebase.data],
  )

  if (!user)
    return (
      <div className={styles.parent}>
        <HomeContent />
      </div>
    )

  return (
    <div className={styles.parent}>
      <Tabs
        items={[
          { label: 'Acasă', key: 'item-1', children: <HomeContent /> },
          {
            label: 'Comenzi noi',
            key: 'item-2',
            children: (
              <Table
                pagination={false}
                scroll={{ x: 800 }}
                dataSource={unFinishedOrders}
                columns={table_unFinished_columns}
              />
            ),
          },
          {
            label: 'Comenzi finalizate',
            key: 'item-3',
            children: (
              <Table
                pagination={false}
                scroll={{ x: 1200 }}
                dataSource={finishedOrders}
                columns={table_completed_columns}
              />
            ),
          },
        ]}
      />
    </div>
  )
}
