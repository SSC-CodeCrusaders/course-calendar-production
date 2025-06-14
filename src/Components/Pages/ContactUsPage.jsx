import React from 'react'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Field, Label, Switch } from '@headlessui/react'

/**
 * The `select` elements in the `ContactUsPage` are mostly manual, and do not use this.
 * Please try editing this function to reflect the current styles of the dropdowns
 * before placing this function in that code.
 */
function Dropdown ({selectedValue, setSelectedValue}) {
    const options = [
        { value: 'feedback', label: 'Feedback' },
        { value: 'help', label: 'Need Help' },
        { value: 'bug', label: 'Bug/problem with the application' }
    ];

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <div className='sm:col-span-1 sm:mt-4'>
            <div className='block w-full rounded-md bg-white px-1.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 
            outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'>
                <select value={selectedValue} onChange={handleChange}>
                    <option value="">Select an option</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

const ContactUsPage = () => {
    const {firstName, setFirstName} = useState('');
    const {lastName, setLastName} = useState('');
    const {email, setEmail} = useState('');
    const {phoneNumber, setPhoneNumber} = useState('');
    const {selectedValue, setSelectedValue} = useState('');
    const {message, setMessage} = useState('');

    function resetValues() {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setSelectedValue('');
        setMessage('');
    }

    return (
        <div className="relative isolate px-6 py-20 sm:pt-10 lg:px-8 min-h-full">

            {/* Background Image Overlay */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0 pointer-events-none"
                style={{ 
                    backgroundImage: "url('/img/lewis_front.jpg')"
                }}
            ></div>
            <div className="relative mx-auto max-w-3xl text-center z-10">
                <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Contact Us</h2>
                <p className="mt-2 text-lg/8 text-gray-600">
                    We would be happy to hear your feedback,
                    as well as answer any questions you may have.
                    <br />
                    (Submitting your feedback may or may not work as
                    this page is under development.)
                </p>
            </div>

            {/* This is the form where the user types everything in */}
            <form className="relative mx-auto mt-10 max-w-xl sm:mt-5 z-10">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                            First name
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 
                                outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                        Last name
                        </label>
                        <div className="mt-2.5">
                        <input
                            id="last-name"
                            name="last-name"
                            type="text"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                            placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
                        Email
                        </label>
                        <div className="mt-2.5">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 
                                placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
                        Phone number
                        </label>
                        <div className="mt-2.5">
                        <div className="flex rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline 
                        has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                            <select
                                id="country"
                                name="country"
                                autoComplete="country"
                                aria-label="Country"
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pl-3.5 pr-7 text-base text-gray-500 
                                placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                <option>US</option>
                                <option>CA</option>
                                <option>EU</option>
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                            </div>
                            <input
                            id="phone-number"
                            name="phone-number"
                            type="text"
                            placeholder="123-456-7890"
                            value={phoneNumber}
                            onChange={(event) => setPhoneNumber(event.target.value)}
                            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 
                            focus:outline focus:outline-0 sm:text-sm/6"
                            />
                        </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="ask" className="block text-sm/6 font-semibold text-gray-900">
                            What would you like to contact us about
                        </label>
                        <div className="flex rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline 
                        has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 mt-2.5">
                            <div className="grid grid-cols-1 w-full focus-within:relative">
                                <select
                                    id="ask"
                                    name="ask"
                                    autoComplete="ask"
                                    aria-label="Ask"
                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pl-3.5 pr-7 text-base text-gray-500 
                                    placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={selectedValue} onChange={(event) => setSelectedValue(event.target.value)}
                                >
                                    <option>Select an option</option>
                                    <option>Feedback</option>
                                    <option>Need help</option>
                                    <option>Bug/problem with the application</option>
                                </select>
                                <ChevronDownIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                        Message
                        </label>
                        <div className="mt-2.5">
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 
                                outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                defaultValue={''}
                            />
                        </div>
                    </div>
                    </div>
                    <div className="mt-10">
                    <button
                        type="submit"
                        onClick={resetValues}
                        className="block w-full rounded-md bg-lewisRed px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm 
                        hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Let's talk
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ContactUsPage