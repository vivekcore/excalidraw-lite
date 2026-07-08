"use client";
import React from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
interface IFeildValues<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  type: string;
}

export function FeildValues<T extends FieldValues>({
  label,
  name,
  register,
  type = "text",
}: IFeildValues<T>) {
  return (
    <div className="space-y-2">
      <label className="pixel-label" htmlFor={name}>
        {label}
      </label>
      <input
        className="pixel-input px-4 py-3"
        type={type}
        id={name}
        {...register(name)}
      />
    </div>
  );
}
