{/*This was a template from tailwind.com that I edited.*/}
import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const initialNavigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'About Us', href: '/about-us', current: false },
  { name: 'FAQ', href: '/faq', current: false },
  { name: 'Tutorial', href: '/tutorial', current: false },
  { name: 'Download', href: '/download', current: false },
  { name: 'Sas', href: '/sas', current: false },
];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white">
      <nav className="mx-auto max-w-7xl py-10 lg:px-8 flex items-center justify-between">
        <div className="flex-shrink-0">
        </div>
        <div className="hidden lg:flex lg:space-x-12 mx-auto">
          {initialNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 text-gray-900 ${item.current ? 'text-indigo-600' : ''}`}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className=" fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {initialNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
