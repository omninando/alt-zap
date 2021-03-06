import React, { FC, useCallback, useState, useMemo } from 'react'
import { Affix, Alert, Button, Divider, Input, Spin, Layout } from 'antd'
import { SendOutlined } from '@ant-design/icons'

import Address from './Address'
import ProductList from './ProductList'
import Totalizer from './Totalizer'
import OrderSummary from './OrderSummary'
import PaymentSelector from './customer/PaymentSelector'
import { useTenantConfig } from '../contexts/TenantContext'
import { generateLink, eSet } from '../utils'

const { Header } = Layout

const Order: FC = () => {
  const { tenant, loading } = useTenantConfig()
  const [address, setAddress] = useState<Address>()
  const [order, setOrder] = useState([])
  const [total, setTotal] = useState(0)
  const [name, setName] = useState('')
  const [info, setInfo] = useState('')
  const [paymentInfo, setPayment] = useState<PaymentInfo>()

  const enviarPedido = useCallback(() => {
    const { name: label, change } = paymentInfo!
    const whatsappLink = generateLink({
      whatsapp: tenant!.whatsapp,
      address: address!,
      order,
      payment: {
        label,
        change,
      },
      name,
      total,
      info,
    })

    const win = window.open(whatsappLink, '_blank')

    win!.focus()
  }, [address, order, info, paymentInfo, name, total, tenant])

  const hasOrder = useMemo(() => {
    return order.some(([, quantity]) => parseInt(quantity, 10))
  }, [order])

  const pedidoValido = useMemo(() => {
    return total > 0 && name && address && address.logradouro
  }, [total, name, address])

  const { deliveryFee, items, paymentMethods } = tenant ?? {}

  return (
    <div>
      {loading && (
        <div className="flex flex-column items-center mt3">
          <Spin />
          <span> Carregando dados...</span>
        </div>
      )}
      {!loading && tenant && !tenant.live && (
        <Alert
          type="warning"
          message="Este estabelecimento não está atendendo agora"
        />
      )}
      {!loading && tenant && tenant.live && (
        <Layout className="pb3">
          <Header
            style={{ position: 'fixed', zIndex: 1, width: '100%' }}
            className="flex justify-center tc mb3"
          >
            <span className="fw2 f3 white">{tenant.name}</span>
          </Header>
          <div className="flex justify-center" style={{ marginTop: '80px' }}>
            <div className="w-90 w-50-l">
              <Alert
                message="No final, vamos te redirecionar pra o Whatsapp para finalizar seu pedido ;)"
                type="info"
              />
              <ProductList items={items!} onOrder={setOrder} />
              <Divider />
              <Address onAddress={setAddress} />
              <Divider />
              <span>Outras Informações?</span>
              <Input.TextArea
                value={info}
                onChange={eSet(setInfo)}
                placeholder="Ex: Tira o sal da batata frita"
                className="mv2"
              />
              <span className="mt2">Seu nome</span>
              <Input
                value={name}
                onChange={eSet(setName)}
                className="mt2"
                size="large"
              />
              <Affix offsetBottom={-5} className="mt4">
                {hasOrder && (
                  <Totalizer
                    order={order}
                    deliveryFee={deliveryFee!}
                    onTotal={setTotal}
                  />
                )}
              </Affix>
              {hasOrder && <OrderSummary order={order} />}
              <Divider />
              {hasOrder && (
                <PaymentSelector
                  methods={paymentMethods!}
                  onPayment={setPayment}
                />
              )}
              <div className="flex justify-center">
                <Button
                  icon={<SendOutlined />}
                  type="primary"
                  className="mt4"
                  size="large"
                  shape="round"
                  disabled={!pedidoValido}
                  onClick={enviarPedido}
                >
                  Enviar Pedido
                </Button>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </div>
  )
}

export default Order
