export const validateEmail = (email) => { 
  const emailRegex = /\S+@\S+\.iiit\.ac\.in/;
  return emailRegex.test(email);
}

export const validateContactNumber = (contactNumber) => {
  const contactNumberRegex = /^\d{10}$/;
  return contactNumberRegex.test(contactNumber);
}

