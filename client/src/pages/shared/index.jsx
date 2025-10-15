import React from 'react'
import { useParams } from 'react-router-dom'
import usePO, { useSinglePO } from '../../hooks/usePO'
import { CircularProgress } from '@mui/material'

const PODetail = () => {
  const {id} = useParams()
  console.log(id)
  const { data: po, isLoading, error } = useSinglePO(id);
console.log(po)
  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error loading PO</div>;
const payload = data?.data?.data

  return <div>PO Number: {po?.poNumber}</div>;
}

export default PODetail