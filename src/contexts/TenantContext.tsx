import React, { FC, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { createCtx, log } from '../utils'

type Props = {
  slug?: string
  tenantId?: string
}

type ContextProps = {
  loading: boolean
  tenantId?: string
  tenant?: TenantConfig
  updateTenant: (data: TenantConfig) => void
}

const [use, TenantProvider] = createCtx<ContextProps>()

export const useTenantConfig = use

export const TenantContextProvider: FC<Props> = ({
  slug,
  tenantId,
  children,
}) => {
  const [tenant, setTenant] = useState<TenantConfig>()
  const [id, setId] = useState(tenantId)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug && !tenantId) return
    const db = firebase.firestore()
    const query = tenantId
      ? () => db.collection('tenants').doc(tenantId).get()
      : () => db.collection('tenants').where('slug', '==', slug).get()

    query()
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((querySnapshot: any) => {
        const [doc] = querySnapshot.docs || [querySnapshot]
        const data = doc.data()

        setId(doc.id)
        setTenant(data)
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        log('Error getting documents: ', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug, tenantId])

  return (
    <TenantProvider
      value={{ loading, tenantId: id, tenant, updateTenant: setTenant }}
    >
      {children}
    </TenantProvider>
  )
}
