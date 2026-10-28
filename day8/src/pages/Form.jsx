
import Button from '../components/common/Button.jsx';
import DropDown from '../components/common/DropDown.jsx';
import FormInput from '../components/common/FormInput.jsx';
import validateBillingForm from "./validation.jsx";


import React from "react";
import { useForm } from "react-hook-form";


import "./Form.css";

function Form() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const validationErrors = validateBillingForm(data);

    clearErrors();

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, {
          type: "manual",
          message,
        });
      });
    } else {
      alert("Billing address saved successfully!");
      console.log(data);
    }
  };

  return (
    <div className="page-container">
      <form className="billing-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Billing Address</h2>

        <FormInput
          label="Name"
          placeholder="Name"
          register={register("name")}
          error={errors.name?.message}
        />

        <FormInput
          label="Email Address"
          type="email"
          placeholder="Email Address"
          register={register("email")}
          error={errors.email?.message}
        />

        <FormInput
          label="Phone Number"
          type="tel"
          placeholder="Phone Number"
          register={register("phone")}
          error={errors.phone?.message}
        />

        <FormInput
          label="Security Code"
          type="password"
          placeholder="Security Code"
          register={register("securityCode")}
          error={errors.securityCode?.message}
        />

        <div className="select-row">
          <DropDown
            label="Country"
            register={register("country")}
            options={["India", "USA", "UK", "Canada"]}
            error={errors.country?.message}
          />

          <DropDown
            label="City"
            register={register("city")}
            options={["Chennai", "Mumbai", "Delhi", "Bangalore"]}
            error={errors.city?.message}
          />
        </div>

        <div className="input-group">
          <textarea
            className="form-input address-input"
            placeholder="Write your Full Address..."
            {...register("address")}
          />

          {errors.address && (
            <p className="error">{errors.address.message}</p>
          )}
        </div>

        <div className="policy">
          <input type="checkbox" {...register("agree")} />
          <label>Agree with Billing Policy</label>
        </div>

        {errors.agree && (
          <p className="error">{errors.agree.message}</p>
        )}

        <Button type="submit">Save &amp; Continue</Button>
      </form>
    </div>
  );
}

export default Form;
