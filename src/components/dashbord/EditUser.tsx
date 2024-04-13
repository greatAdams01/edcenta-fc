import React, { useEffect, useState } from 'react';
import { IUser } from '../../../types';
import { useMutation } from '@apollo/client';
import { EDIT_USER } from '@/apollo/mutations/admin';
import { showToast } from '@/utils/toast';

interface EditUserProps {
  user: IUser;
  // onSave: (updatedUser: IUser) => void;
}

const EditUser: React.FC<EditUserProps> = ({ user }) => {
  const [editedUser, setEditedUser] = useState<IUser>(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };


  const handleSave = () => {
    editUserInfo()
  };


  const [editUserInfo, { loading }] = useMutation(EDIT_USER, {
    variables: {
      firstName: editedUser.firstName,
      lastName: editedUser.lastName,
      email: editedUser.email,
      phone: editedUser.phone,
      address: editedUser.address,
      sex: editedUser.sex,
      dob: editedUser.dob,
      city: editedUser.city,
      state: editedUser.state,
      bankName: editedUser.bankName,
      bank: editedUser.bank,
      acctNumber: editedUser.acctNumber,
      bankCode: editedUser.bankCode,
      id: editedUser._id
    },
    onCompleted: (data) => {
      console.log(data)
        showToast('success', 'User Updated')
      // reload the page
    },
    onError: (error) => {
      showToast('error', error.message)
      // setLoading(false);
    },
  });

  useEffect(() => {
    setEditedUser(user);
  }, [user])

  return (
    <div>
      <h2>Edit User</h2>
      <form className='w-[800px]'>
        <div className='flex space-x-5'>
          <div>
            <label htmlFor="firstName" className="block text-md font-medium leading-6 text-gray-900">
            First name
          </label>
          <div className="mt-2">
            <input
              type="firstName"
              name="firstName"
              id="firstName"
              value={editedUser.firstName}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="First name"
            />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-md font-medium leading-6 text-gray-900">
            Last name
            </label>
          <div className="mt-2">
            <input
              type="lastName"
              name="lastName"
              id="lastName"
              value={editedUser.lastName}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="Last name"
            />
            </div>
          </div>
        </div>
        <div className='flex space-x-5 mt-5'>
          <div>
            <label htmlFor="email" className="block text-md font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              value={editedUser.email}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="you@example.com"
            />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-md font-medium leading-6 text-gray-900">
            Phone
            </label>
          <div className="mt-2">
            <input
              type="phone"
              name="phone"
              id="phone"
              value={editedUser.phone}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="you@example.com"
            />
            </div>
          </div>
        </div>
        <div className='flex space-x-5 mt-5'>
          <div>
            <label htmlFor="address" className="block text-md font-medium leading-6 text-gray-900">
            Address
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="address"
              id="address"
              value={editedUser.address}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="you@example.com"
            />
            </div>
          </div>
          <div>
            <label htmlFor="dob" className="block text-md font-medium leading-6 text-gray-900">
            Date of birth
            </label>
          <div className="mt-2">
            <input
              type="date"
              name="dob"
              id="dob"
              value={editedUser.dob}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="you@example.com"
            />
            </div>
          </div>
        </div>

        <div className='flex space-x-5 mt-5'>
          <div>
            <label htmlFor="state" className="block text-md font-medium leading-6 text-gray-900">
            State
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="state"
              id="state"
              value={editedUser.state}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="you@example.com"
            />
            </div>
          </div>
          <div>
            <label htmlFor="city" className="block text-md font-medium leading-6 text-gray-900">
            City
            </label>
          <div className="mt-2">
            <input
              type="text"
              name="city"
              id="city"
              value={editedUser.city}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="you@example.com"
            />
            </div>
          </div>
        </div>

        <div className='flex space-x-5 mt-5'>
          <div>
            <label htmlFor="sex" className="block text-md font-medium leading-6 text-gray-900">
            Sex
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="sex"
              id="sex"
              value={editedUser.sex}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="you@example.com"
            />
            </div>
          </div>
          <div>
            <label htmlFor="accountType" className="block text-md font-medium leading-6 text-gray-900">
            AccountType
            </label>
          <div className="mt-2">
            <input
              type="text"
              name="accountType"
              id="accountType"
              value={editedUser.accountType}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="you@example.com"
            />
            </div>
          </div>
        </div>

        <div className='flex space-x-5 mt-5'>
          <div>
            <label htmlFor="bankName" className="block text-md font-medium leading-6 text-gray-900">
            Bank Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="bankName"
              id="bankName"
              value={editedUser.bankName}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="Name of the account"
            />
            </div>
          </div>
          <div>
            <label htmlFor="bank" className="block text-md font-medium leading-6 text-gray-900">
            Bank
            </label>
          <div className="mt-2">
            <input
              type="text"
              name="bank"
              id="bank"
              value={editedUser.bank}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="Bank"
            />
            </div>
          </div>
        </div>

        <div className='flex space-x-5 mt-5'>
          <div>
            <label htmlFor="acctNumber" className="block text-md font-medium leading-6 text-gray-900">
            Account number
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="acctNumber"
              id="acctNumber"
              value={editedUser.acctNumber}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="Account number"
            />
            </div>
          </div>
          <div>
            <label htmlFor="bankCode" className="block text-md font-medium leading-6 text-gray-900">
            Bank Code
            </label>
          <div className="mt-2">
            <input
              type="text"
              name="bankCode"
              id="bankCode"
              value={editedUser.bankCode}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2.5 px-2 lg:w-[400px] text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:text-md md:leading-6"
              placeholder="Bank code"
            />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto mt-5"
          onClick={handleSave}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditUser;