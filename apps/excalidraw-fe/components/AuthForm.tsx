"use client"
import React from 'react'
import { FieldValues, UseFormRegister,Path  } from 'react-hook-form'
interface IFeildValues<T extends FieldValues> {
    label:string,
    name:Path<T>,
    register: UseFormRegister<T>;
    type:string
}

export function FeildValues<T extends FieldValues>({label,name,register,type = "text"}:IFeildValues<T>) {

  return (
    <div>
       <label htmlFor={name}>{label}</label>
       <input className='border' type={type} id={name} {...register(name)} />
    </div>
  )
}
