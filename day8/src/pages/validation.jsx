function validateBillingForm(data) {
  const errors = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "Name is required";
  } else if (!/^[a-zA-Z\s]+$/.test(data.name)) {
    errors.name = "Enter a valid name";
  }

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email";
  }

  if (!data.phone || data.phone.trim() === "") {
    errors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(data.phone)) {
    errors.phone = "Enter a 10-digit phone number";
  }

  if (!data.securityCode || data.securityCode.trim() === "") {
    errors.securityCode = "Security code is required";
  } else if (!/^\d{3,4}$/.test(data.securityCode)) {
    errors.securityCode = "Enter a 3 or 4 digit code";
  }

  if (!data.country) {
    errors.country = "Please select a country";
  } else if (!data.city) {
    errors.city = "Please select a city";
  }

  if (!data.address || data.address.trim() === "") {
    errors.address = "Full address is required";
  }

  if (!data.agree) {
    errors.agree = "Please agree with the billing policy";
  }

  return errors;
}

export default validateBillingForm;